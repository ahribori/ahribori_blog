import React, {Component, PropTypes} from 'react';
import {Textfield} from 'react-mdl';
import { browserHistory } from 'react-router';

class Search extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			searchString: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	
	handleChange(e) {
		this.setState({
			searchString: e.target.value
		})
	}

	handleKeyPress(e) {
		if (e.keyCode === 27) {
			this.setState({
				searchString: ''
			});
			e.target.blur()
		}

		if (e.keyCode === 13 && this.state.searchString !== '') {
			browserHistory.push(`/search/${this.state.searchString}`);
		}

		if (e.keyCode === 13 && this.state.searchString === '' && /\/search\/.+$/.test(window.location.pathname)) {
            browserHistory.push('/');
		}
	}

	render() {
		return (
			<Textfield
				onFocus={this.props.onFocus}
				onBlur={this.props.onBlur}
				value={this.state.searchString}
				onChange={this.handleChange}
				onKeyDown={this.handleKeyPress}
				className="search"
				label="Search"
				expandable
				expandableIcon="search"
			/>
		);
	}
}

export default Search;