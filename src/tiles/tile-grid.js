import { uniq } from 'lodash/array'

export class TileGrid {
  constructor (opts) {
    this.tiles = opts.tiles
    this.type = opts.type
    this.tileSize = opts.type === 'terrain@2x' ? 512 : 256
    this.rows = uniq(this.tiles.map(([x, y, z]) => y)).length
    this.columns = uniq(this.tiles.map(([x, y, z]) => x)).length
    this.z = this.tiles[0][2]
    this.sortTiles()
    this.setDetails()
  }

  sortTiles () {
    const yValues = uniq(this.tiles.map(([x, y, z]) => y)).sort()
    const xValues = uniq(this.tiles.map(([x, y, z]) => x)).sort()
    const tiles = []
    for (var i = 0; i < yValues.length; i++) {
      for (var j = 0; j < xValues.length; j++) {
        tiles.push([xValues[j], yValues[i], this.z])
      }
    }
    this.tiles = tiles
  }

  setDetails () {
    this.shape = { rows: this.rows, columns: this.columns }
    this.width = this.columns * this.tileSize
    this.height = this.rows * this.tileSize
    this.start = this.tiles[0]
  }
}
