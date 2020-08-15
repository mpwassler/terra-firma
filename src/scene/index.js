
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
  Mesh
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import config from '../../config'
import geometry from './geometry'
import { GeoLine } from './geoline'
import { makeSky } from './sky'
import gsap from 'gsap'

// Initilaize and set up the 3d scene
const width = window ? window.innerWidth : 1000

const height = window ? window.innerHeight : 1000

const scene = new Scene()

const camera = new PerspectiveCamera(75, width / height, 0.1, config.VIEW_RANGE)

var canvas = document.createElement('canvas')

var context = canvas.getContext('webgl2', { alpha: false })

const renderer = new WebGLRenderer({ canvas: canvas, context: context })

camera.up.set(0, 0, 1)

const controls = new OrbitControls(camera, renderer.domElement)

const initilaize = (element) => {
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  if (element) element.appendChild(renderer.domElement)
  controls.update()
  window.addEventListener( 'resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight )
  }, false )
}

const setCameraTarget = (center) => {
  const vec = new Vector3(center.x, center.y, center.z)
  scene.add(makeSky(vec))

  controls.target = vec
  controls.update()
  camera.position.set(
    controls.target.x,
    controls.target.y - 2000,
    7000
  )
}

const setMesh = async (meshConfig, loadedCb) => {
  geometry.build({
    pixels: meshConfig.pixelData,
    meters: meshConfig.metersPerTile,
    gridSize: [meshConfig.gridColumns, meshConfig.gridRows],
    widthRes: meshConfig.xResolution,
    heightRes: meshConfig.yResolutuin
  }, async (geometry, averageElevation) => {
    const mesh = new Mesh(geometry, meshConfig.material)
    mesh.position.set(meshConfig.center.x, meshConfig.center.y, 0)
    scene.add(mesh)
    loadedCb(averageElevation)
  })
}

const drawLine = (geojson) => {
  const line = new GeoLine(geojson)
  scene.add(line.toMesh())
}

const animationLoop = () => {
  if (!window.requestAnimationFrame) return false
  window.requestAnimationFrame(animationLoop)
  controls.update()
  renderer.render(scene, camera)
}

const start = async () => {
  animationLoop()
}

const add = (obj) => {
  scene.add(obj)
}

const lookAt = ({ x, y, z }) => {
  const animationSettings = {
    ease: 'power3.out',
    duration: 1
  }
  gsap.to(camera.position, {
    ...animationSettings,
    x,
    y: (y + 500),
    z: (z + 1500)
  })
  gsap.to(controls.target, { ...animationSettings, x: x, y: y, z })
}

export default {
  start,
  setCameraTarget,
  setMesh,
  drawLine,
  initilaize,
  add,
  lookAt
}
