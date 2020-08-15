import { Linestring } from '../../../src/map/geography/linestring'
const { test, expect } = global

const geojson = { type: 'LineString', coordinates: [[0, 0], [10, 10]] }

test('Has a path property', () => {
  const linestring = new Linestring(geojson)
  expect(linestring.path).toBeDefined()
})

test('Projects path to the correct value in meters', () => {
  const linestring = new Linestring(geojson)
  expect(linestring.path).toEqual({
    type: 'LineString',
    coordinates: [
      [0, -0.00007882812058450512],
      [20037508.342789244, 1116048.1095913863]
    ]
  })
})
