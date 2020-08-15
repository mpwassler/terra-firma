import { TileGrid } from '../../../src/map/tiles/tile-grid'
const { test, expect } = global

const tiles = [
  [6, 12, 5],
  [5, 12, 5],
  [6, 13, 5],
  [5, 13, 5]
]

const sortedTiles = [
  [5, 12, 5],
  [6, 12, 5],
  [5, 13, 5],
  [6, 13, 5]
]

test('Sorts tiles in order', () => {
  const grid = new TileGrid({ tiles })
  expect(grid.tiles).toEqual(sortedTiles)
})

test('Gets correct row column counts', () => {
  const grid = new TileGrid({ tiles })
  expect(grid.shape.rows).toEqual(2)
  expect(grid.shape.columns).toEqual(2)
})
