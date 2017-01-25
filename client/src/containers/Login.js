import React, {Component, PropTypes} from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { loginRequest } from 'actions/authentication';
import { Snackbar } from 'react-mdl';

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			snackbarMessage: '',
			isSnackbarActive: false
		};

		this.handleLogin = this.handleLogin.bind(this);
		this.handleShowSnackbar = this.handleShowSnackbar.bind(this);
		this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
	}

	handleLogin(id, pw) {
		return this.props.loginRequest(id, pw)
			.then(() => {
				if (this.props.status === 'SUCCESS') {
					if (window.localStorage) {
						const localStorage = window.localStorage;
						localStorage.setItem('ahribori_token', this.props.token);
					}
					localStorage.setItem('snackbar', '인증되었습니다');
					browserHistory.push('/');
					return true;
				} else {
					this.handleShowSnackbar('아이디 또는 패스워드가 잘못되었습니다');
					return false;
				}
			});
	}

	handleShowSnackbar(message) {
		this.setState({
			snackbarMessage: message,
			isSnackbarActive: true
		});
	}

	handleTimeoutSnackbar() {
		this.setState({
			snackbarMessage: '',
			isSnackbarActive: false
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
				<Snackbar
					active={this.state.isSnackbarActive}
					onTimeout={this.handleTimeoutSnackbar}
					// action="Undo"
				>{this.state.snackbarMessage}</Snackbar>
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