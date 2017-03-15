import React, {Component, PropTypes} from 'react';
import {Textfield} from 'react-mdl';
import { browserHistory } from 'react-router';

class Search extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			searchString: ''
		};
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleFocus(e) {
        this.props.onFocus();
        this.setState({
        	searchString: ''
		});
	}

	handleBlur(e) {
        this.props.onBlur();
        this.setState({
            searchString: ''
        });
        e.target.parentNode.parentNode.classList.remove('is-focused');
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
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
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