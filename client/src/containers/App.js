import React, {Component, PropTypes} from 'react';
import { Navigation, Sidebar } from 'components';
import { browserHistory } from 'react-router';
import { Layout, Content } from 'react-mdl';
import { connect } from 'react-redux';
import { getStatusRequest, getKakaoStatusRequest, setKakaoAuth, logout, kakaoLogout } from 'actions/authentication';
import { Snackbar } from 'react-mdl';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			snackbarMessage: '',
			isSnackbarActive: false
		};

		this.handleLogout = this.handleLogout.bind(this);
		this.handleShowSnackbar = this.handleShowSnackbar.bind(this);
		this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
	}

	componentDidMount() {
		if (window.localStorage) {
			const localStorage = window.localStorage;
			const token = localStorage.getItem('ahribori_token');

			let storedKakaoAuth = localStorage.getItem('kakao_token');
			if (storedKakaoAuth) {
				storedKakaoAuth = JSON.parse(atob(storedKakaoAuth));
				this.props.setKakaoAuth(storedKakaoAuth);
				this.props.getKakaoStatusRequest()
					.catch(() => {
						Kakao.Auth.logout();
					})
			}
			if (token) {
				this.props.getStatusRequest(token)
					.then(() => {
					});
			}
		} else {
			console.log('localStorage를 지원하지 않습니다.')
		}
	}

	handleLogout() {
		if (this.props.status.loginType === 'KAKAO') {
			Kakao.Auth.logout();
			localStorage.removeItem('kakao_token');
			this.props.kakaoLogout();
		} else {
			localStorage.removeItem('ahribori_token');
			this.props.logout();
		}
		this.handleShowSnackbar('로그아웃 되었습니다.');
		browserHistory.push('/login');
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

	componentWillReceiveProps() {
		const message = localStorage.getItem('snackbar');
		if (message) {
			this.handleShowSnackbar(message)
		}
		localStorage.removeItem('snackbar')
	}

	render() {
		return (
			<div>
				<Layout fixedHeader fixedDrawer>
					<Navigation isLoggedIn={this.props.status.isLoggedIn} onLogout={this.handleLogout}/>
					<Sidebar user={this.props.user}/>
					<Content>
						<div style={{margin: 'auto'}}>
							{this.props.children}
						</div>
					</Content>
				</Layout>
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
		status: state.authentication.status,
		user: state.authentication.user
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getStatusRequest: (token) => {
			return dispatch(getStatusRequest(token));
		},
		getKakaoStatusRequest: () => {
			return dispatch(getKakaoStatusRequest());
		},
		setKakaoAuth: (auth) => {
			return dispatch(setKakaoAuth(auth));
		},
		logout: () => {
			return dispatch(logout());
		},
		kakaoLogout: () => {
			return dispatch(kakaoLogout());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(App);