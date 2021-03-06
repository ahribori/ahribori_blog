import React from 'react';
import { Helmet } from 'react-helmet';
import { Navigation, BottomNavigation, Sidebar } from '../components';
import { Layout, Content } from 'react-mdl';
import { connect } from 'react-redux';
import { getCategoryRequest } from '../actions/category';
import { getStatusRequest, getKakaoStatusRequest, setKakaoAuth, logout, kakaoLogout } from '../actions/authentication';
import { Snackbar } from 'react-mdl';
const isServer = typeof window === 'undefined' || !window.document || !window.document.createElement;

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			snackbarMessage: '',
			isSnackbarActive: false,
			authChecked: false,
            selectedIndex: 0,
		};
		this.handleLogout = this.handleLogout.bind(this);
		this.handleShowSnackbar = this.handleShowSnackbar.bind(this);
		this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
		this.onLoad = this.onLoad.bind(this);
	}

    static fetchDataServerSide({ store, params, history }) {
        return store.dispatch(getCategoryRequest(process.env.TOKEN));
    }

	onLoad() {
		setTimeout(() => {
        	document.getElementById('layout').style.visibility = 'visible';
		}, 0);
	}

	componentWillMount() {
		const loadingElement =  document.getElementById('loading');
		if (loadingElement) {
			loadingElement.remove ? loadingElement.remove() : loadingElement.removeNode(true);
		}
	}

	componentDidMount() {
		this.onLoad();
		if (window.localStorage) {
			const localStorage = window.localStorage;
			const token = localStorage.getItem('ahribori_token');
			if (token) {
				this.props.getStatusRequest(token)
					.then(() => {
						this.setState({
							authChecked: true
						})
					})
			} else {
				this.setState({
					authChecked: true
				})
			}

		} else {
			console.log('localStorage를 지원하지 않습니다.')
		}

		this.props.getCategoryRequest(process.env.TOKEN)
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
		const categories = this.props.category.response ? this.props.category.response.response : [];

		return (
			<div>
                <Helmet>
					<meta name="description" content="Enjoy development!" />
					<meta name="keywords" content="JavaScript,Node.js,Java,React,HTML,CSS" />
					<meta name="author" content="아리보리" />
					<meta property="og:title" content="Ahribori's Blog" />
					<meta property="og:description" content="Enjoy development!" />
					<meta property="og:image" content="/favicon/cats.png" />
                    <title>Ahribori's Blog</title>
                </Helmet>
				<Layout fixedHeader fixedDrawer id="layout" style={{ visibility: 'hidden'}}>
					<Navigation isLoggedIn={this.props.status.isLoggedIn} onLogout={this.handleLogout}/>
					<Sidebar user={this.props.user}
							 categories={categories} />
					<Content>
						<div style={{margin: 'auto'}}>
							{(this.state.authChecked || isServer) ? this.props.children :
								<div style={{ textAlign: 'center', marginTop: '20px' }}>
									<h3 style={{ fontFamily: 'iropkeBatangM' }}>인증 요청 중...</h3>
								</div>}
						</div>
					</Content>
					<BottomNavigation />
				</Layout>
				<Snackbar
					active={this.state.isSnackbarActive}
					onTimeout={this.handleTimeoutSnackbar}
				>{this.state.snackbarMessage}</Snackbar>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		status: state.authentication.status,
		user: state.authentication.user,
		category: state.category.get
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
		},
		getCategoryRequest: (token) => {
			return dispatch(getCategoryRequest(token));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(App);