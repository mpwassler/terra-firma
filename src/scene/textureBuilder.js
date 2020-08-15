import config from '../../config'
import { EventEmitter } from '../events'

const getToken = () => `?access_token=${window.API_TOKEN}`

const terrainTilePath = ([x, y, z]) => {
  return `${config.TERRAIN_BASE_URL}/${z}/${x}/${y}.pngraw${getToken()}`
}

const sataliteTilePath = ([x, y, z]) => {
  return `${config.SATALITE_BASE_URL}/${z}/${x}/${y}@2x.png${getToken()}`
}

export class TextureBuilder extends EventEmitter {
  constructor (tileGrid) {
    super()
    this.type = tileGrid.type
    this.grid = tileGrid
    this.loaded = 0
    this.debug = false
    this.tileSize = this.grid.type === 'terrain@2x' ? 512 : 256
    this.buildCanvas()
  }

  buildCanvas () {
    this.canvas = document.createElement('canvas')
    this.canvas.height = this.grid.shape.rows * this.tileSize
    this.canvas.width = this.grid.shape.columns * this.tileSize
    if (this.debug) document.body.appendChild(this.canvas)
    this.context = this.canvas.getContext('2d')
  }

  layoutTiles () {
    let x = 0
    let y = 0
    let column = 1
    let row = 1
    const imagePathFunc = this.type === 'terrain' ? terrainTilePath : sataliteTilePath
    this.grid.tiles.forEach((tile, index) => {
      const url = imagePathFunc(tile)
      x = this.tileSize * (column - 1)
      y = this.tileSize * (row - 1)
      this.loadAndDrawImage(url, x, y)
      column += 1
      if (column > this.grid.shape.columns) {
        column = 1
        row += 1
      }
    })
  }

  loadAndDrawImage (url, x, y) {
    var image = new window.Image()
    image.crossOrigin = 'Anonymous'
    image.onload = () => {
      this.loaded += 1
      this.context.drawImage(image, x, y, this.tileSize, this.tileSize)
      this.emit('image-loaded', {
        count: this.loaded,
        total: this.grid.tiles.length
      })
      if (this.loaded === this.grid.tiles.length) {
        this.emit('all-data-loaded')
      }
    }
    image.src = url
  }

  imagesLoaded () {
    var event = new window.Event('data-loaded')
    this.canvas.dispatchEvent(event)
  }

  process () {
    this.layoutTiles()
    return new Promise((resolve, reject) => {
      this.on('all-data-loaded', () => {
        resolve(this)
      })
    })
  }

  prefetch () {
    const imagePathFunc = this.type === 'terrain' ? terrainTilePath : sataliteTilePath
    this.tiles.forEach(tile => {
      var image = new window.Image()
      image.src = imagePathFunc(tile)
    })
  }

  async pixelData () {
    await this.process()
    return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
  }
}
