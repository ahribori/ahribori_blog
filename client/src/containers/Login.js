import React, {Component, PropTypes} from 'react';
import { Authentication, KakaoAuthentication } from 'components';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { loginRequest, getStatusRequest, getKakaoStatusRequest, kakaoLogin } from 'actions/authentication';
import { Snackbar } from 'react-mdl';

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			snackbarMessage: '',
			isSnackbarActive: false,
			token: ''
		};

		this.handleLogin = this.handleLogin.bind(this);
		this.handleShowSnackbar = this.handleShowSnackbar.bind(this);
		this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
	}

	handleLogin(id, pw) {
		return this.props.loginRequest(id, pw)
			.then(() => {
				if (this.props.status === 'SUCCESS') {
					this.setState({
						token: this.props.token
					});
					if (window.localStorage) {
						const localStorage = window.localStorage;
						localStorage.setItem('ahribori_token', this.props.token);
					}
					return true;
				} else {
					this.handleShowSnackbar('아이디 또는 패스워드가 잘못되었습니다');
					return false;
				}
			})
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
					user={this.props.user}
					onLogin={this.handleLogin}
					getStatusRequest={this.props.getStatusRequest}
					token={this.state.token}
				/>
				<KakaoAuthentication
					onLogin={this.props.kakaoLogin}
					getKakaoStatusRequest={this.props.getKakaoStatusRequest}
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
		user: state.authentication.user,
		status: state.authentication.login.status,
		errorCode: state.authentication.login.error,
		token: state.authentication.status.accessToken,
		isLoggedIn: state.authentication.status.isLoggedIn
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		loginRequest: (id, pw) => {
			return dispatch(loginRequest(id, pw));
		},
		getStatusRequest: (token) => {
			return dispatch(getStatusRequest(token));
		},
		kakaoLogin: (response) => {
			return dispatch(kakaoLogin(response));
		},
		getKakaoStatusRequest: () => {
			return dispatch(getKakaoStatusRequest());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);