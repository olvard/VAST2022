import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'
import * as topojson from 'https://unpkg.com/topojson@3?module'

export default function Buildings() {
	var width = 960,
		height = 500

	var path = d3.geoPath()

	var svg = d3.select('body').append('svg').attr('width', width).attr('height', height)

	var url = 'Datasets/Cleaned/buildings.json'

	d3.json(url).then(function (topology) {
		console.log('topojson', topology)
		var geojson = topojson.feature(topology, topology.objects.buildings)
		console.log('geojson', geojson)

		svg.selectAll('path').data(geojson.features).enter().append('path').attr('d', path)
	})
}
