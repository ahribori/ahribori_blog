import React, {Component, PropTypes} from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { loginRequest } from 'actions/authentication';

class Login extends React.Component {

	constructor(props) {
		super(props);

		this.handleLogin = this.handleLogin.bind(this);
	}

	handleLogin(id, pw) {
		return this.props.loginRequest(id, pw)
			.then(() => {
				if (this.props.status === 'SUCCESS') {
					if (window.localStorage) {
						const localStorage = window.localStorage;
						localStorage.setItem('ahribori_token', this.props.token);
					}
					localStorage.setItem('snackbar', '인증되었습니다')
					browserHistory.push('/');
					return true;
				} else {
					return false;
				}
			});
	}

	componentDidMount() {
		if (this.props.isLoggedIn) {
			browserHistory.push('/');
		}
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
		token: state.authentication.status.token,
		isLoggedIn: state.authentication.status.isLoggedIn
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