import React from 'react';
import { render } from 'react-dom';
import BarChart from './components/BarChart';
import { data } from './data';

function App() {
	return <BarChart data={data} />;
}

render(<App />, document.getElementById('root'));
