import React, {Component, PropTypes} from 'react';
import { browserHistory } from 'react-router';
import {IconButton, Menu, MenuItem} from 'react-mdl';

const propTypes = {
	isLoggedIn: React.PropTypes.bool
};

const defaultProps = {
	isLoggedIn: false
};

class NavigationMenu extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
	}

	handleLogin() {
		browserHistory.push('/login');
	}

	handleLogout() {
		this.props.onLogout();
	}

	render() {

		const loginComponent = (
			<IconButton name="vpn_key" onClick={this.handleLogin} />
		);

		const menuComponent = (
			<div>
				<IconButton name="more_vert" id="demo-menu-lower-right"/>
				<Menu target="demo-menu-lower-right" align="right">
					<MenuItem onClick={this.handleLogout}>로그아웃</MenuItem>
				</Menu>
			</div>
		);

		return (
			<div>
				{this.props.isLoggedIn ? menuComponent : loginComponent}
			</div>
		);
	}
}

NavigationMenu.propTypes = propTypes;

NavigationMenu.defaultProps = defaultProps;

export default NavigationMenu;