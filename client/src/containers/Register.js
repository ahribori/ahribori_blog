import React, {Component, PropTypes} from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { registerRequest } from 'actions/authentication';
import { Snackbar } from 'react-mdl';

class Register extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			snackbarMessage: '',
			isSnackbarActive: false
		};

		this.handleRegister = this.handleRegister.bind(this);
		this.handleShowSnackbar = this.handleShowSnackbar.bind(this);
		this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
	}

	handleRegister(id, pw, nick) {
		return this.props.registerRequest(id, pw, nick)
			.then(() => {
				if (this.props.status === 'SUCCESS') {
					browserHistory.push('/login');
					return true;
				} else {
					if (this.props.error) {
						switch (this.props.error.status) {
							case 400:
								this.handleShowSnackbar('등록이 거부되었습니다');
								break;
							case 409:
								this.handleShowSnackbar('이미 등록된 계정입니다');
								break;
							default:
								break;
						}
					} else {
						this.handleShowSnackbar('인증 서버와의 연결에 실패하였습니다')
					}
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

	render() {
		return (
			<div>
				<Authentication
					isLoggedIn={this.props.isLoggedIn}
					mode={'REGISTER'}
					onRegister={this.handleRegister}
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
		status: state.authentication.register.status,
		error: state.authentication.register.error,
		isLoggedIn: state.authentication.status.isLoggedIn
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		registerRequest: (id, pw, nick) => {
			return dispatch(registerRequest(id, pw, nick));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);