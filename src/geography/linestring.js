import { Geography } from './geography'
import * as cover from '@mapbox/tile-cover'
import * as turf from '@turf/turf'

const limits = { min_zoom: 15, max_zoom: 15 }

export class Linestring extends Geography {
  get path () {
    return this.project(this.geojson)
  }

  getTiles () {
    const boundingBox = turf.bboxPolygon(this.boundingBox)
    const tileset = cover.tiles(boundingBox.geometry, limits)
    const tilePloygons = cover.geojson(boundingBox.geometry, limits)
    const center = turf.center(tilePloygons)

    return {
      tiles: tileset,
      polygons: this.project(tilePloygons),
      center: this.toVector(this.project(center))
    }
  }
}
