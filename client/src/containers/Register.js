import React, {Component, PropTypes} from 'react';
import { Authentication } from 'components';

const propTypes = {};

const defaultProps = {};

class Register extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<Authentication mode={'REGISTER'}/>
			</div>
		);
	}
}

Register.propTypes = propTypes;

Register.defaultProps = defaultProps;

export default Register;