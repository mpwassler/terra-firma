
import { Vector3 } from 'three'
import { Sky } from './shaders/sun.js'

const makeSky = (center) => {
  const sky = new Sky()

  var distance = 400000

  var skySettings = {
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    inclination: 0.3448, // elevation / inclination
    azimuth: 0.25, // Facing front,
    sun: !true
  }

  const updateSkySettings = () => {
    var uniforms = sky.material.uniforms
    uniforms.up.value = new Vector3(0, 0, 1)
    uniforms.turbidity.value = skySettings.turbidity
    uniforms.rayleigh.value = skySettings.rayleigh
    uniforms.mieCoefficient.value = skySettings.mieCoefficient
    uniforms.mieDirectionalG.value = skySettings.mieDirectionalG
    uniforms.luminance.value = skySettings.luminance

    var theta = Math.PI * (skySettings.inclination - 0.5)
    var phi = 2 * Math.PI * (skySettings.azimuth - 0.5)

    const pos = new Vector3()

    pos.x = distance * Math.cos(phi)
    pos.z = distance * Math.sin(phi) * Math.sin(theta)
    pos.y = distance * Math.sin(phi) * Math.cos(theta)

    uniforms.sunPosition.value = pos
    uniforms.cameraPos.value = new Vector3(center.x, center.y, center.z)
  }

  updateSkySettings()

  sky.scale.setScalar(30000)
  sky.position.set(center.x, center.y, center.z)

  return sky
}

export {
  makeSky
}
