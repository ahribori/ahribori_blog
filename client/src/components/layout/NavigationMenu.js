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
	}

	handleClick() {
		browserHistory.push('/login');
	}

	render() {

		const loginComponent = (
			<IconButton name="vpn_key" onClick={this.handleClick} />
		);

		const menuComponent = (
			<div>
				<IconButton name="more_vert" id="demo-menu-lower-right"/>
				<Menu target="demo-menu-lower-right" align="right">
					<MenuItem>Some Action</MenuItem>
					<MenuItem>Another Action</MenuItem>
					<MenuItem disabled>Disabled Action</MenuItem>
					<MenuItem>Yet Another Action</MenuItem>
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