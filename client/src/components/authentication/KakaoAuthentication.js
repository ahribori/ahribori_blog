import React, {Component, PropTypes} from 'react';
import { Grid, Cell, Card, CardText } from 'react-mdl';
import { browserHistory } from 'react-router';

const propTypes = {};

const defaultProps = {};

class KakaoAuthentication extends React.Component {

	constructor(props) {
		super(props);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleCreateLoginButton = this.handleCreateLoginButton.bind(this);
	}

	handleLogin(response) {
		this.props.onLogin(response);
		const localStorage = window.localStorage;
		localStorage.setItem('kakao_token', btoa(JSON.stringify(response)));
		browserHistory.push('/');
	}

	handleCreateLoginButton() {
		const self = this;
		Kakao.Auth.createLoginButton({
			container: '#kakao-login-btn',
			success: function(authObj) {
				self.handleLogin(authObj);
				self.props.getKakaoStatusRequest()
					.then(() => {
						// 카카오 유저정보 획득 성공
					})
					.catch(() => {
						// 카카오 유저정보 획득 실패
					})
			},
			fail: function(err) {
				alert(JSON.stringify(err));
			}
		});
	}
	
	componentDidMount() {
		this.handleCreateLoginButton();
	}

	render() {
		return (
			<Grid className="kakaoAuthentication">
				<Cell
					offsetDesktop={3}
					col={6}
					tablet={12}
					phone={12}>
					<Card shadow={0} style={{width: 'auto', margin: '0px auto', minHeight: '80px'}}>
						<CardText id="kakao-login-btn" style={{width: 'auto', margin: '0px auto'}}/>
					</Card>
				</Cell>
			</Grid>
		);
	}
}

KakaoAuthentication.propTypes = propTypes;

KakaoAuthentication.defaultProps = defaultProps;

export default KakaoAuthentication;