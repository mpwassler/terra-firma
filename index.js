import TerraFirma from './src'

let polygon = {
    "type": "Feature",
    "properties": {},
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [-107.810905, 38.014829],
                [-107.810905, 37.975056],
                [-107.758338, 37.975056],
                [-107.758338, 38.014829],
                [-107.810905, 38.014829]
            ]
        ]
    }
}

console.log(process.env)


window.addEventListener('DOMContentLoaded', (event) => {

  let mapElemenat = document.getElementById('map')

  let map3d = new TerraFirma({
    element: mapElemenat,
    feature: polygon,
    buffer: 500,
    bufferUnit: 'meters',
    resolutionMultiple: 1,
    apiToken: process.env.MAPBOX_API_TOKEN
  })

})

