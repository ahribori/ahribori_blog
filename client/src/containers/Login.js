import React, {Component, PropTypes} from 'react';
import { Authentication, KakaoAuthentication, FacebookAuthentication, GoogleAuthentication } from '../components';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Grid, Cell, Card, CardText } from 'react-mdl';
import { loginRequest, oAuthLoginRequest, getStatusRequest } from '../actions/authentication';
import { Snackbar } from 'react-mdl';

class Login extends React.Component {

	constructor(props) {
		super(props);
		const callback = props.location.callback ? props.location.query.callback : '';
		this.state = {
			snackbarMessage: '',
			isSnackbarActive: false,
            callback
		};
		this.handleLogin = this.handleLogin.bind(this);
		this.handleOAuthLogin = this.handleOAuthLogin.bind(this);
		this.handleRedirect = this.handleRedirect.bind(this);
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
					return true;
				} else {
					this.handleShowSnackbar('아이디 또는 패스워드가 잘못되었습니다');
					return false;
				}
			})
	}

	handleOAuthLogin(account_type, social_id, nickname, thumbnail_image) {
        this.props.oAuthLoginRequest(account_type, social_id, nickname, thumbnail_image)
			.then(() => {
                if (this.props.status === 'SUCCESS') {
                    if (window.localStorage) {
                        const localStorage = window.localStorage;
                        this.props.getStatusRequest(this.props.token).then(() => {
                        	localStorage.setItem('ahribori_token', this.props.token);
							localStorage.setItem('snackbar', `${this.props.user.type} 계정으로 인증되었습니다.`);
							this.handleRedirect();
						});
                    }
                    return true;
                } else {
                    this.handleShowSnackbar('인증 과정에 문제가 발생하셨습니다.');
                    return false;
                }
			})
	}

	handleRedirect() {
		if (this.state.callback === '') {
			browserHistory.push('/');
		} else {
			browserHistory.push(this.state.callback);
		}
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

	render() {
		return (
			<div>
				<Authentication
					mode={'LOGIN'}
					isLoggedIn={this.props.isLoggedIn}
					user={this.props.user}
					onLogin={this.handleLogin}
					getStatusRequest={this.props.getStatusRequest}
					token={this.props.token}
				/>
				<Grid className="socialAuthentication">
					<Cell
						offsetDesktop={3}
						col={6}
						tablet={12}
						phone={12}>
						<Card shadow={0} style={{width: 'auto', margin: '0px auto', minHeight: '80px'}}>
							<CardText  style={{ width: 'auto', margin: '0px auto' }} >
								<KakaoAuthentication loginRequest={this.handleOAuthLogin}/>
								<FacebookAuthentication loginRequest={this.handleOAuthLogin}/>
								<GoogleAuthentication loginRequest={this.handleOAuthLogin}/>
							</CardText>
						</Card>
					</Cell>
				</Grid>
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
		oAuthLoginRequest: (account_type, social_id, nickname, thumbnail_image) => {
			return dispatch(oAuthLoginRequest(account_type, social_id, nickname, thumbnail_image));
		},
		getStatusRequest: (token) => {
			return dispatch(getStatusRequest(token));
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);