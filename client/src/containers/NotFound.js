import React, {Component, PropTypes} from 'react';

const propTypes = {};

const defaultProps = {};

class NotFound extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>404 Not Found</div>
		);
	}
}

NotFound.propTypes = propTypes;

NotFound.defaultProps = defaultProps;

export default NotFound;