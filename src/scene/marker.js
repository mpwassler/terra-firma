import { Sprite, SpriteMaterial, TextureLoader } from 'three'

class Marker {
  constructor (point) {
    const sprite = this.makeSprite()
    sprite.position.set(point.x, point.y, point.z)
    sprite.scale.set(150, 150, 150)
    this.sprite = sprite
  }

  makeSprite () {
    const spriteMap = new TextureLoader().load('/marker.png')
    const spriteMaterial = new SpriteMaterial({ map: spriteMap, color: 0xffffff })
    return new Sprite(spriteMaterial)
  }
}

export default Marker
