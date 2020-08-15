import {
  MeshBasicMaterial,
  CanvasTexture,
  LinearFilter
} from 'three'
import tilebelt from '@mapbox/tilebelt'
import { flatten } from 'lodash/array'

import { TileGrid } from '../tiles/tile-grid'
import { TextureBuilder } from './textureBuilder'

const buildMaterial = async (tiles) => {
  const tileZoom1 = tiles.map(tileInfo => {
    return tilebelt.getChildren(tileInfo)
  })

  const textrueGrid = new TileGrid({ tiles: flatten(tileZoom1) })
  const textureBuilder = new TextureBuilder(textrueGrid)

  await textureBuilder.process()
  const texture = new CanvasTexture(textureBuilder.canvas)
  // do this only on desktop
  texture.minFilter = LinearFilter
  const material = new MeshBasicMaterial({ map: texture })
  return material
}

export {
  buildMaterial
}
