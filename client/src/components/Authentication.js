import React, {Component, PropTypes} from 'react';
import { Grid, Cell, Card, CardTitle, CardActions, Button, CardMenu, CardText, IconButton, Textfield } from 'react-mdl';
import { browserHistory } from 'react-router';
import update from 'react-addons-update';

const propTypes = {
	mode: React.PropTypes.string,
	onLogin: React.PropTypes.func,
	onRegister: React.PropTypes.func
};

const defaultProps = {
	mode: 'LOGIN',
	onLogin: (id, pw) => { console.error('login function not defined'); },
	onRegister: (id, pw) => { console.error('register function not defined'); }
};

class Authentication extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			password_confirm: '',
			nickname: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleKeypress = this.handleKeypress.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}

	handleChange(e) {
		let nextState = {};
		nextState[e.target.name] = {
			$set: e.target.value
		};
		this.setState(update(this.state, nextState));
	}

	handleKeypress(e) {
		if (e.charCode === 13) {
			if (this.props.mode === 'LOGIN') {
				this.handleLogin();
			} else {
				this.handleRegister();
			}
		}
	}

	handleRegister() {
		this.props.onRegister(this.state.username, this.state.password, this.state.nickname)
			.then((result) => {
				if (!result) {
					this.setState({
						username: '',
						password: '',
						password_confirm: '',
						nickname: ''
					});
					document.getElementsByName('username')[0].focus();
				}
			})
	}

	handleLogin() {
		this.props.onLogin(this.state.username, this.state.password)
			.then((success) => {
				if (!success) {
					this.setState({
						password: ''
					})
				} else {
					return this.props.getStatusRequest(this.props.token)
						.then(() => {
							localStorage.setItem('snackbar', `${this.props.user.username}계정 인증되었습니다.`);
							browserHistory.push('/');
						});
				}

			});
	}

	componentDidMount() {
		document.getElementsByName('username')[0].focus();
	}

	render() {
		const loginButtonset = (
			<div>
				<Button
					onClick={() => {
						this.handleLogin();
					}}
					colored>로그인</Button>
				<Button
					onClick={() => {
						browserHistory.push('/register')
					}}
					colored>계정 만들기</Button>
			</div>
		);
		
		const registerButtonSet = (
			<div>
				<Button
					onClick={() => {
						this.handleRegister();
					}}
					colored>등록</Button>
				<Button
					onClick={() => {
						browserHistory.push('/login')
					}}
					colored>취소</Button>
			</div>
		);

		const nicknameField = (
			<Textfield
				name="nickname"
				value={this.state.nickname}
				onChange={this.handleChange}
				pattern="[a-zA-Z가-힣]{2,16}"
				error="닉네임은 2~16자의 한글,영문자 입니다"
				label="닉네임"
				floatingLabel
				style={{ width: '100%' }}
			/>
		);

		const passwordConfirmField = (
			<Textfield
				name="password_confirm"
				value={this.state.password_confirm}
				type="password"
				onChange={this.handleChange}
				onKeyPress={this.handleKeypress}
				pattern={this.state.password_confirm === '' ? '.*' : this.state.password}
				error="비밀번호와 동일한 값을 입력하세요"
				label="비밀번호 확인"
				floatingLabel
				style={{ width: '100%' }}
			/>
		);

		return (
			<Grid className="authentication">
				<Cell
					offsetDesktop={3}
					col={6}
					tablet={12}
					phone={12}>
					<Card shadow={0} style={{width: 'auto', margin: 'auto'}}>
						<CardTitle
							style={ this.props.mode === 'LOGIN' ?
							{color: '#fff', height: '176px', background: 'url(/image/i1.jpg) center / cover'} :
							{color: '#fff', height: '176px', background: 'url(/image/i2.png) center / cover'}}>
							{ this.props.mode === 'LOGIN' ? '계정 인증' : '계정 만들기'}
						</CardTitle>
						<CardText>
							<Textfield
								name="username"
								value={this.state.username}
								onChange={this.handleChange}
								pattern={this.props.mode === "LOGIN" ?
								'.*' : "[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})" }
								error="이메일 형식으로 입력하세요"
								label="아이디(이메일)"
								floatingLabel
								style={{ width: '100%' }}
							/>
							<Textfield
								name="password"
								value={this.state.password}
								type="password"
								onChange={this.handleChange}
								onKeyPress={this.handleKeypress}
								pattern={this.props.mode === "LOGIN" ?
								'.*' : "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"}
								error="8자 이상의 특수문자,숫자,대소문자 조합입니다"
								label="비밀번호"
								floatingLabel
								style={{ width: '100%' }}
							/>
							{ this.props.mode !== 'LOGIN' ? passwordConfirmField : ''}
							{ this.props.mode !== 'LOGIN' ? nicknameField : ''}
						</CardText>
						<CardActions border>
							{ this.props.mode === 'LOGIN' ? loginButtonset : registerButtonSet}
						</CardActions>
					</Card>
				</Cell>
			</Grid>
		);
	}
}

Authentication.propTypes = propTypes;

Authentication.defaultProps = defaultProps;

export default Authentication;