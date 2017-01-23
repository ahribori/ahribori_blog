import React, {Component, PropTypes} from 'react';
import {Grid, Cell} from 'react-mdl';

const propTypes = {};

const defaultProps = {};

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<Grid className="demo-grid-ruler">
					<Cell col={1}>1</Cell>
					<Cell col={1}>1</Cell>
					<Cell col={1}>1</Cell>
					<Cell col={1}>1</Cell>
					<Cell col={1}>1</Cell>
					<Cell col={1}>1</Cell>
					<Cell col={1}>1</Cell>
					<Cell col={1}>1</Cell>
					<Cell col={1}>1</Cell>
					<Cell col={1}>1</Cell>
					<Cell col={1}>1</Cell>
					<Cell col={1}>1</Cell>
				</Grid>
				<Grid className="demo-grid-1">
					<Cell col={4}>4</Cell>
					<Cell col={4}>4</Cell>
					<Cell col={4}>4</Cell>
				</Grid>
				<Grid className="demo-grid-2">
					<Cell col={6}>6</Cell>
					<Cell col={4}>4</Cell>
					<Cell col={2}>2</Cell>
				</Grid>
				<Grid className="demo-grid-3">
					<Cell col={6} tablet={8}>6 (8 tablet)</Cell>
					<Cell col={4} tablet={6}>4 (6 tablet)</Cell>
					<Cell col={2} phone={4}>2 (4 phone)</Cell>
				</Grid>
			</div>
		);
	}
}

Home.propTypes = propTypes;

Home.defaultProps = defaultProps;

export default Home;