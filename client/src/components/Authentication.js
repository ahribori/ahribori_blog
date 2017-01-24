import React, {Component, PropTypes} from 'react';
import { Grid, Cell, Card, CardTitle, CartText, CardActions, Button, CardMenu, CardText, IconButton } from 'react-mdl';
import TextField from 'material-ui/TextField';
import { browserHistory } from 'react-router';

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
	}

	render() {

		const loginButtonset = (
			<div>
				<Button
					onClick={() => {
						browserHistory.push('/login')
					}}
					colored>로그인</Button>
				<Button
					onClick={() => {
						browserHistory.push('/register')
					}}
					colored>계정 생성</Button>
			</div>
		);
		
		const registerButtonSet = (
			<div>
				<Button
					onClick={() => {
						browserHistory.push('/register')
					}}
					colored>등록</Button>
				<Button
					onClick={() => {
						browserHistory.push('/login')
					}}
					colored>취소</Button>
			</div>
		)

		return (
			<Grid className="authentication">
				<Cell
					offsetDesktop={3}
					col={6}
					tablet={12}
					phone={12}>
					<Card shadow={0} style={{width: 'auto', margin: 'auto'}}>
						<CardTitle
							style={{color: '#fff', height: '176px', background: 'url(http://www.getmdl.io/assets/demos/welcome_card.jpg) center / cover'}}
						>
							{ this.props.mode === 'LOGIN' ? 'Sign In' : 'Sign Up'}
						</CardTitle>
						<CardText>
							<TextField
								hintText="Username"
								fullWidth={true}
							/>
							<TextField
								hintText="Password"
								type="password"
								fullWidth={true}
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