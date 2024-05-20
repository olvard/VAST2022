import Buildings from './coords.js'
import Timeline from './timeline.js'

// Load the SVG container and base map image
const width = 1076
const height = 1144
// const svg = d3.select('body').append('svg').attr('width', width).attr('height', height)
// svg.append('image').attr('xlink:href', 'BaseMap.png').attr('width', width).attr('height', height)
const svg = Buildings()

// Load and visualize the first dataset
d3.csv('../Datasets/Cleaned/ParticipantStatusLogs0.csv')
	.then(function (data0) {
		visualizeData(data0, 'slateblue')
		Timeline(data0, 1)
	})
	.catch(function (error) {
		console.error('Error loading the first data: ', error)
	})

// Load and visualize the second dataset
d3.csv('../Datasets/Cleaned/ParticipantStatusLogs1.csv')
	.then(function (data1) {
		visualizeData(data1, 'tomato')
		Timeline(data1, 2)
	})
	.catch(function (error) {
		console.error('Error loading the second data: ', error)
	})

// Function to visualize data
function visualizeData(data, color) {
	// Parse the POINT objects and extract x and y coordinates
	data.forEach(function (d) {
		var coordinates = d.currentLocation.match(/-?\d+\.\d+/g)
		d.x = parseFloat(coordinates[0]) // Extract x coordinate
		d.y = parseFloat(coordinates[1]) // Extract y coordinate
	})

	// Define the desired extent
	var extent = [
		[-4762, -30],
		[2650, 7850],
	]

	// Compute the scale and translation based on the desired extent and image dimensions
	var xScale = width / (extent[1][0] - extent[0][0])
	var yScale = height / (extent[1][1] - extent[0][1])
	var scale = Math.min(xScale, yScale)
	var translate = [-scale * extent[0][0], height + scale * extent[0][1]]

	// Define a projection with the desired extent
	var projection = d3
		.geoIdentity()
		.reflectY(true)
		.fitExtent(
			[
				[0, 0],
				[width, height],
			],
			{
				type: 'MultiPoint',
				coordinates: data.map(function (d) {
					return [d.x, d.y]
				}),
			}
		)
		.scale(scale)
		.translate(translate)

	// Define the line generator with a smoothing curve
	var lineGenerator = d3
		.line()
		.x(function (d) {
			return projection([d.x, d.y])[0]
		})
		.y(function (d) {
			return projection([d.x, d.y])[1]
		})
		.curve(d3.curveBumpX)

	// Join the data and create the path
	svg.selectAll(`.${color}.line`)
		.data([data])
		.enter()
		.append('path')
		.attr('d', lineGenerator)
		.attr('stroke', color)
		.attr('stroke-width', 1.5)
		.style('stroke-opacity', 0.5)
		.attr('fill', 'none')

	// Draw points
	svg.selectAll(`.${color}.circle`)
		.data(data)
		.enter()
		.append('circle')
		.attr('r', 3)
		.attr('transform', function (d) {
			return 'translate(' + projection([d.x, d.y]) + ')'
		})
		.attr('fill', color)
		.style('fill-opacity', 0.1)
}

var legendData = [
	{ label: 'Work', color: 'slategray' },
	{ label: 'Home', color: 'lightblue' },
	{ label: 'Restaurant', color: 'springgreen' },
	{ label: 'Transport', color: 'deeppink' },
	{ label: 'Reacreation', color: 'pink' },
]

var legend = d3
	.select('#timelineLegend')
	.append('svg')
	.attr('width', 800)
	.attr('height', 50)
	.append('g')
	.attr('class', 'legend')

var legendItem = legend
	.selectAll('.legend-item')
	.data(legendData)
	.enter()
	.append('g')
	.attr('class', 'legend-item')
	.attr('transform', function (d, i) {
		return 'translate(' + i * 150 + ', 20)'
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
