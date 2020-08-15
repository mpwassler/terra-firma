import { Geography } from '../../../src/map/geography/geography'
import { Vector3 } from 'three'
const { test, expect } = global

const geojson = { type: 'LineString', coordinates: [[0, 0], [10, 10]] }

const matchVector = new Vector3(556597.4539663679, 557305.2572745753, 0)

test('Returns its center as vector in meteres', () => {
  const geography = new Geography(geojson)
  expect(geography.centerPoint()).toEqual(matchVector)
})
