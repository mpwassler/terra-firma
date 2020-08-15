const getTileMeters = (feature) => {
  const a = feature.geometry.coordinates[0][2][0]
  const b = feature.geometry.coordinates[0][0][0]
  return a - b
}

export default {
  getTileMeters
}
