import {
  PlaneBufferGeometry,
  BufferAttribute
} from 'three'

window.PlaneBufferGeometry = PlaneBufferGeometry

const workerFunc = () => {
  importScripts("https://cdnjs.cloudflare.com/ajax/libs/three.js/r119/three.min.js")

  const parseMdArray = (rawData) => {
    const elevations = new Float32Array(rawData.length / 4)
    for (var i = 0, j = 0, l = rawData.length; i < l; i++, j += 4) {
      elevations[i] = rgbToElevation(rawData[j], rawData[j + 1], rawData[j + 2])
    }
    return elevations
  }

  const rgbToElevation = (R, G, B) => {
    return -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)
  }

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  self.onmessage = function ({
    data: {
      pixels,
      meters,
      gridSize,
      postition,
      widthRes,
      heightRes
    }
  }) {
    const heights = parseMdArray(pixels.data)
    const geometry = new THREE.PlaneBufferGeometry(
      meters * gridSize[0],
      meters * gridSize[1],
      widthRes - 1,
      heightRes - 1
    )

    var averageElevation = 0

    var vertices = geometry.attributes.position.array
    for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      let height = heights[i]
      vertices[j + 2] = height
      if(isNumeric(height)) {
        averageElevation += height
      }

    }
    averageElevation = averageElevation / heights.length
    self.postMessage({ meters, gridSize, postition, vertices, widthRes, heightRes, averageElevation })
  }
}

var blobURL = URL.createObjectURL(new Blob(
  ['(', workerFunc.toString(), ')()'],
  {type: 'application/javascript'}
))

const elevationWorker = new window.Worker(blobURL)

const build = (data, onComplete) => {
  elevationWorker.postMessage(data)
  elevationWorker.onmessage = (event) => {
    const { vertices, meters, gridSize, widthRes, heightRes, averageElevation } = event.data
    const geometry = new PlaneBufferGeometry(
      meters * gridSize[0],
      meters * gridSize[1],
      widthRes - 1,
      heightRes - 1
    )
    geometry.setAttribute('position', new BufferAttribute(vertices, 3))
    onComplete(geometry, averageElevation)
  }
}

export default {
  build
}
