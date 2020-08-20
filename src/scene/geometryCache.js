import { openDB, deleteDB, wrap, unwrap } from 'idb'

const STORE_NAME = "geometry-cache"
const DB_NAME = "map3d"
const VERSION = 1

const dbPromise = openDB(DB_NAME, VERSION, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME)
  },
})

export default {
  async save(key, value) {
    return (await dbPromise).put(STORE_NAME, value, key)
  },

  async get(key, value) {
    return (await dbPromise).get(STORE_NAME, key)
  },

  async hasVerticiesFor (key) {
    let cache = await dbPromise
    let val = await cache.get(STORE_NAME, key)
    return !!val
  }
}
