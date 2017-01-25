import React, {Component, PropTypes} from 'react';
import { Navigation, Sidebar } from 'components';
import { Layout, Content } from 'react-mdl';
import { connect } from 'react-redux';
import { toggleSidebar } from 'actions/application';
import { getStatusRequest, logout } from 'actions/authentication';
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
			if (token) {
				this.props.getStatusRequest(token)
					.then(() => {
					});
			}
		} else {
			console.log(document.cookie)
		}
	}

	handleLogout() {
		if (window.localStorage) {
			const localStorage = window.localStorage;
			localStorage.removeItem('ahribori_token');
		}
		this.handleShowSnackbar('로그아웃 되었습니다.');
		this.props.logout();
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
					<Sidebar />
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
		sidebar: state.application.sidebar,
		status: state.authentication.status
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getStatusRequest: (token) => {
			return dispatch(getStatusRequest(token));
		},
		logout: () => {
			return dispatch(logout());
		},
		toggleSidebar: () => {
			return dispatch(toggleSidebar());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(App);