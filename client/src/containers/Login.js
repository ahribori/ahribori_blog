import React, {Component, PropTypes} from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { loginRequest } from 'actions/authentication';

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.handleLogin = this.handleLogin.bind(this);
	}

	handleLogin(id, pw) {
		return this.props.loginRequest(id, pw)
			.then(() => {
				if (this.props.status === 'SUCCESS') {
					document.cookie = `ahriori_token=${this.props.token}; httpOnly;`;
					browserHistory.push('/');
					return true;
				} else {
					return false;
				}
			});
	}

	render() {
		return (
			<div>
				<Authentication
					mode={'LOGIN'}
					onLogin={this.handleLogin}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		status: state.authentication.login.status,
		errorCode: state.authentication.login.error,
		token: state.authentication.status.token
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		loginRequest: (id, pw) => {
			return dispatch(loginRequest(id, pw));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);