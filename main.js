import Buildings from './coords.js'

// Load the SVG container and base map image
const width = 1076
const height = 1144
// const svg = d3.select('body').append('svg').attr('width', width).attr('height', height)
// svg.append('image').attr('xlink:href', 'BaseMap.png').attr('width', width).attr('height', height)
const svg = Buildings()

// Load and visualize the first dataset
d3.csv('Datasets/Cleaned/ParticipantStatusLogs0.csv')
	.then(function (data0) {
		visualizeData(data0, 'slateblue')
	})
	.catch(function (error) {
		console.error('Error loading the first data: ', error)
	})

// Load and visualize the second dataset
d3.csv('Datasets/Cleaned/ParticipantStatusLogs1.csv')
	.then(function (data1) {
		visualizeData(data1, 'mediumorchid')
	})
	.catch(function (error) {
		console.error('Error loading the second data: ', error)
	})

// Function to visualize data
function visualizeData(data, color) {
	// Parse the POINT objects and extract x and y coordinates
	data.forEach(function (d) {
		var coordinates = d.currentLocation.match(/-?\d+\.\d+/g) // Extract numerical values
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

	// Draw lines between data points
	svg.selectAll(`.${color}.line`)
		.data(data)
		.enter()
		.append('line')
		.attr('x1', function (d) {
			return projection([d.x, d.y])[0]
		})
		.attr('y1', function (d) {
			return projection([d.x, d.y])[1]
		})
		.attr('x2', function (d, i, nodes) {
			if (i < nodes.length - 1) {
				return projection([data[i + 1].x, data[i + 1].y])[0]
			}
		})
		.attr('y2', function (d, i, nodes) {
			if (i < nodes.length - 1) {
				return projection([data[i + 1].x, data[i + 1].y])[1]
			}
		})
		.attr('stroke', color)
		.attr('stroke-width', 1)
		.style('stroke-opacity', 0.2)

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
