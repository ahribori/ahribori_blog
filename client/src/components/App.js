import React, {Component, PropTypes} from 'react';

const propTypes = {};

const defaultProps = {};

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>Hello React!</div>
		);
	}
}

App.propTypes = propTypes;

App.defaultProps = defaultProps;

export default App;