import React, {Component, PropTypes} from 'react';
import { Grid, Cell, Card, CardTitle, CartText, CardActions, Button, CardMenu, CardText, IconButton, Textfield } from 'react-mdl';
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
			password: ''
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
		this.props.onRegister(this.state.username, this.state.password)
			.then((result) => {
				if (!result) {
					this.setState({
						username: '',
						password: ''
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
				}
			});
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
								// pattern="([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}"
								// error="Input is not a email!"
								label="Email..."
								floatingLabel
								style={{ width: '100%' }}
							/>
							<Textfield
								name="password"
								ref="password"
								value={this.state.password}
								type="password"
								onChange={this.handleChange}
								onKeyPress={this.handleKeypress}
								// pattern="-?[0-9]*(\.[0-9]+)?"
								// error="Password required!"
								label="Password..."
								floatingLabel
								style={{ width: '100%' }}
							/>
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