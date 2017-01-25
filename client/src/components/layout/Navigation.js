import React, {Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';
import {Header} from 'react-mdl';
import Search from './Search';
import NavigationMenu from './NavigationMenu';

const propTypes = {
	isLoggedIn: React.PropTypes.bool,
	onLogout: React.PropTypes.func
};

const defaultProps = {
	isLoggedIn: false,
	onLogout: () => { console.error('logout function not defined') }
};

class Navigation extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			searchFocused: false
		};
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}

	handleClick() {
		browserHistory.push('/');
	}

	handleFocus() {
		const width = document.getElementsByClassName('mdl-layout__header-row')[0].clientWidth;
		if (width < 500) {
			this.setState({
				searchFocused: true
			});
		}
	}

	handleBlur() {
		this.setState({
			searchFocused: false
		});
	}

	render() {
		const headerTitle = () => {
			return (
				<div onClick={this.handleClick} className="title">
					{this.state.searchFocused ? '' : 'AHRIBORI.COM'}
				</div>
			);
		};

		return (
			<Header className="navigation" title={headerTitle()}>
				<Search onFocus={this.handleFocus} onBlur={this.handleBlur}/>
				<NavigationMenu isLoggedIn={this.props.isLoggedIn} onLogout={this.props.onLogout} />
			</Header>
		);
	}
}

Navigation.propTypes = propTypes;

Navigation.defaultProps = defaultProps;

export default Navigation;