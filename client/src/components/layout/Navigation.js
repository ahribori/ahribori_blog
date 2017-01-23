import React, {Component, PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import {Header} from 'react-mdl';
import Search from './Search';
import NavigationMenu from './NavigationMenu';

class Navigation extends React.Component {

	constructor(props) {
		super(props);
	}

	handleClick() {
		browserHistory.push('/');
	}

	render() {
		const headerTitle = () => {
			return (
				<div onClick={this.handleClick} className="title">
					AHRIBORI.COM
				</div>
			);
		};

		return (
			<Header className="navigation" title={headerTitle()}>
				<Search />
				<NavigationMenu />
			</Header>
		);
	}
}

export default Navigation;