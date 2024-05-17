import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'

export default function Buildings() {
	d3.csv('Datasets/Attributes/Buildings.csv').then(function (data) {
		const extent = d3.extent(data, (d) => [+d.x, +d.y])
		console.log(extent)
	})
}
