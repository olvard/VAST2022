import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'
import * as topojson from 'https://unpkg.com/topojson@3?module'

export default function Buildings() {
	var width = 1076,
		height = 1144

	var path = d3.geoPath()

	var svg = d3.select('body').append('svg').attr('width', width).attr('height', height).classed('toposvg', true)

	var url = 'Datasets/Cleaned/buildings.json'

	d3.json(url).then(function (topology) {
		console.log('topojson', topology)
		var geojson = topojson.feature(topology, topology.objects.buildings)
		console.log('geojson', geojson)

		var projection = d3.geoIdentity().reflectY(true).fitSize([width, height], geojson)
		path.projection(projection)

		svg.selectAll('path')
			.data(geojson.features)
			.enter()
			.append('path')
			.attr('d', path)
			.attr('fill', function (d) {
				return d.properties.buildingType === 'Residential'
					? 'lightblue'
					: d.properties.buildingType === 'Commercial'
					? 'wheat'
					: 'lightgrey'
			})

		var legend = svg.append('g').attr('class', 'legend').attr('transform', 'translate(20, 20)')

		var legendData = [
			{ label: 'Residential', color: 'lightblue' },
			{ label: 'Commercial', color: 'wheat' },
			{ label: 'School', color: 'lightgrey' },
			{ label: 'Participant 1', color: 'slateblue' },
			{ label: 'Participant 2', color: 'mediumorchid' },
		]

		var legendItem = legend
			.selectAll('.legend-item')
			.data(legendData)
			.enter()
			.append('g')
			.attr('class', 'legend-item')
			.attr('transform', function (d, i) {
				return 'translate(' + (width - 180) + ', ' + (i * 20 + 40) + ')'
			})

		legendItem
			.append('rect')
			.attr('width', 10)
			.attr('height', 10)
			.attr('fill', function (d) {
				return d.color
			})

		legendItem
			.append('text')
			.attr('x', 20)
			.attr('y', 10)
			.text(function (d) {
				return d.label
			})
	})

	return svg
}
