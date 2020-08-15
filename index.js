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


window.addEventListener('DOMContentLoaded', (event) => {

  let mapElemenat = document.getElementById('map')

  let map3d = new TerraFirma({
    element: mapElemenat,
    feature: polygon,
    buffer: 10,
    bufferUnit: 'meters',
    resolutionMultiple: 1,
    apiToken: ""
  })

})

