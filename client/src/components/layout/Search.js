import React, {Component, PropTypes} from 'react';
import {Textfield} from 'react-mdl';

class Search extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			searchString: ''
		};
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(e) {
		this.setState({
			searchString: e.target.value
		})
	}

	render() {
		return (
			<Textfield
				onFocus={this.props.onFocus}
				onBlur={this.props.onBlur}
				value={this.state.searchString}
				onChange={this.handleChange}
				className="search"
				label="Search"
				expandable
				expandableIcon="search"
			/>
		);
	}
}

export default Search;