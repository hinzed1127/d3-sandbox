import React from 'react';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import { transition } from 'd3-transition'; // eslint-disable-line no-unused-vars
import '../styles.css';

const margin = {
	top: 10,
	right: 10,
	bottom: 20,
	left: 50
};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

export default class BarChart extends React.Component {
	componentDidMount() {
		this.createScales();
		this.createAxes();
		this.updateChart('math');
	}

	createScales() {
		const { data } = this.props;

		this.xScale = scaleBand()
			.domain(data.map(d => d.name))
			.range([0, width]);

		this.yScale = scaleLinear()
			.domain([0, 100])
			.range([height, 0]);
	}

	createAxes() {
		const svg = select(this.container)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.style('position', 'absolute')
			.style('top', 0)
			.style('left', 0);

		const axisContainer = svg.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		axisContainer.append('g')
			.attr('transform', `translate(0, ${height})`)
			.call(axisBottom(this.xScale));

		axisContainer.append('g')
			.call(axisLeft(this.yScale));
	}

	updateChart(subject) {
		const bars = select(this.container)
			.selectAll('div')
			.data(this.props.data, d => d.name);

		bars
			.exit()
			.remove();

		bars
			.enter()
			.append('div')
			.attr('class', 'bar')
			.style('width', d => `${this.xScale.bandwidth() - 2}px`)
			.style('height', 0)
			.style('margin-top', `${height}px`)
			.merge(bars)
			.transition()
			.style('height', d => `${height - this.yScale(d.subjects[subject])}px`)
			.style('margin-top', d => `${this.yScale(d.subjects[subject])}px`);
	}

	render() {
		return (
			<div>
				<div className='chart' ref={container => (this.container = container)} />
				{Object.keys(this.props.data[0].subjects).map(subject => {
					return (
						<button key={subject} onClick={() => this.updateChart(subject)}>
							{subject.charAt(0).toUpperCase() + subject.slice(1)}
						</button>
					);
				})}
			</div>
		);
	}
}