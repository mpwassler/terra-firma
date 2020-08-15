import { LineBasicMaterial, Vector3, BufferGeometry, Line } from 'three'

export class GeoLine {
  constructor (geoJson) {
    this.geoJson = geoJson
  }

  verticies () {
    return this.geoJson.coordinates.map(point => {
      return new Vector3(point[0], point[1], point[2] + 20)
    })
  }

  geometry () {
    return new BufferGeometry().setFromPoints(this.verticies())
  }

  material () {
    return new LineBasicMaterial({
      color: 0xffff00,
      linewidth: 3
    })
  }

  toMesh () {
    return new Line(this.geometry(), this.material())
  }
}
