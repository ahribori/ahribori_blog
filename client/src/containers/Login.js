import React, {Component, PropTypes} from 'react';
import { Authentication } from 'components';

const propTypes = {};

const defaultProps = {};

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<Authentication mode={'LOGIN'}/>
			</div>
		);
	}
}

Login.propTypes = propTypes;

Login.defaultProps = defaultProps;

export default Login;