import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'

export default function Timeline(data, index) {
	const width = 2000
	const svg = d3.select('#timeline').append('svg').attr('width', width).attr('height', 70)

	data.forEach(function (d) {
		d.timestamp = new Date(d.timestamp)
	})
	data.sort((a, b) => a.timestamp - b.timestamp)

	// Define the time scale
	const timeScale = d3
		.scaleTime()
		.domain(d3.extent(data, (d) => d.timestamp))
		.range([0, 2000])

	// Create a group for the timeline
	const timelineGroup = svg.append('g').attr('transform', `translate(30, 30)`)

	// Add the timeline axis
	const axis = d3.axisBottom(timeScale).ticks(20)
	timelineGroup.append('g').attr('class', 'axis').call(axis)
	// Add a title to the timeline
	timelineGroup
		.append('text')
		.attr('x', 0)
		.attr('y', 20)
		.text('P' + index)
		.attr('font-size', '16px')
		.attr('font-weight', 'bold')

	// Add recs to the timeline
	timelineGroup
		.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('x', (d) => timeScale(d.timestamp))
		.attr('y', -20) // Adjust the y position as needed
		.attr('width', 10)
		.attr('height', 20)
		.attr('fill', (d) => {
			if (d.currentMode === 'AtWork') {
				return 'slategray'
			} else if (d.currentMode === 'AtHome') {
				return 'lightblue'
			} else if (d.currentMode === 'AtRestaurant') {
				return 'springgreen'
			} else if (d.currentMode === 'AtRecreation') {
				return 'pink'
			} else if (d.currentMode === 'Transport') {
				return 'deeppink'
			} else {
				return 'gray'
			}
		})
}
