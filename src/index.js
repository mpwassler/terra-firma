import scene from './scene'
import * as turf from '@turf/turf'
import { Vector3 } from 'three'
import { Linestring } from './geography/linestring.js'
import Marker from './scene/marker'

import { TileGrid } from './tiles/tile-grid'
import { TextureBuilder } from './scene/textureBuilder'
import { buildMaterial } from './scene/material'
import { EventEmitter } from './events'

const getTileMeters = (feature) => {
  const a = feature.geometry.coordinates[0][2][0]
  const b = feature.geometry.coordinates[0][0][0]
  return a - b
}

class TerraFirma extends EventEmitter {
  constructor (opts) {
    super()
    this.element = opts.element
    this.opts = opts
    this.scene = scene
    window.API_TOKEN = opts.apiToken
    console.log( window.API_TOKEN)
    this.startLoading()
    this.on('load', () => {
      this.stopLoading()
    })
    this.init()
  }

  startLoading () {
    this.element.style.position = 'relative'
    var div = document.createElement('div')
    div.classList.add('loading')
    div.innerHTML = `
      <progress class="progress is-small is-primary" max="100">15%</progress>
    `.trim()
    this.loader = div
    this.element.appendChild(div)
  }

  stopLoading () {
    this.loader.remove()
  }

  async init () {
    console.log( window.API_TOKEN)
    this.feature = new Linestring(this.opts.feature)

    this.scene.initilaize(this.element)

    const bufferSize = this.opts.buffer || 2.5

    const bufferUnit = this.opts.bufferUnit || 'miles'

    const { tiles, polygons, center } = this.feature
      .bufferBy(bufferSize, bufferUnit)
      .getTiles()



    this.scene.start()

    const metersPerTile = getTileMeters(polygons.features[0])

    const elevationGrid = new TileGrid({ tiles, type: 'terrain' })

    const textureBuilder = new TextureBuilder(elevationGrid)

    const [material, pixelData] = await Promise.all([buildMaterial(tiles), textureBuilder.pixelData()])

    const meshConfig = {
      tiles: tiles,
      center: center,
      features: polygons,
      gridRows: elevationGrid.shape.rows,
      gridColumns: elevationGrid.shape.columns,
      xResolution: elevationGrid.width,
      yResolutuin: elevationGrid.height,
      metersPerTile,
      pixelData,
      material
    }

    this.scene.setMesh(meshConfig, (averageElevation) => {
      this.scene.setCameraTarget({
        x: center.x,
        y: center.y,
        z: averageElevation
      })
      this.emit('load')
    })
  }

  drawLine (geojson) {
    const linestring = new Linestring(geojson)
    this.scene.drawLine(linestring.path)
  }

  drawMarker (point) {
    const position = this.pointToVector(point)
    const marker = new Marker(position)

    this.scene.add(marker.sprite)
  }

  focusOn (point) {
    this.scene.lookAt(this.pointToVector(point))
  }

  pointToVector (point) {
    const projectedPoint = turf.toMercator(point)
    return new Vector3(
      projectedPoint.coordinates[0],
      projectedPoint.coordinates[1],
      projectedPoint.coordinates[2] + 75
    )
  }
}

export default TerraFirma
