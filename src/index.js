import React from 'react';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import { transition } from 'd3-transition'; // eslint-disable-line no-unused-vars
import { render } from 'react-dom';
import { data } from './data';

const styles = {
	position: 'relative',
	padding: '10px 10px 20px 50px'
};

const margin = {
	top: 10,
	right: 10,
	bottom: 20,
	left: 50
};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

class App extends React.Component {
	componentDidMount() {
		this.createScales();
		this.createAxes();
		this.updateChart('math');
	}

	createScales() {
		const { data } = this.props;

		this.xScale = scaleLinear()
			.domain([0, 100])
			.range([0, width]);

		this.yScale = scaleBand()
			.domain(data.map(d => d.name))
			.range([0, height]);
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

		bars.exit().remove();

		bars
			.enter()
			.append('div')
			.merge(bars)
			.transition()
			.style('height', '20px')
			.style('background-color', 'teal')
			.style('margin-top', '2px')
			.style('width', d => `${this.xScale(d.subjects[subject])}px`)
			.style('height', d => `${this.yScale.bandwidth() - 2}px`); //subtract 2 to account for margin-top
	}

	render() {
		return (
			<div>
				<div style={styles} ref={container => (this.container = container)} />
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

render(<App data={data} />, document.getElementById('root'));
