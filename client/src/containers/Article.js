import React, { Component, PropTypes } from 'react';

const propTypes = {

};

const defaultProps = {

};

class Article extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {
		return (
			<div>Article id: {this.props.params.id}</div>
		);
	}

	componentDidMount() {

	}

	componentWillReceiveProps() {

	}

	shouldComponentUpdate() {
	    /*
		 props/state 변경시 rerendering 여부
		 true 반환시 render() 실행 후 componentWillUpdate 실행
		 */
		return true;
	}

	componentWillUpdate() {
	    // setState() 사용 금지
	}

	componentDidUpdate() {
	    // setState() 사용 금지
	}

}

Article.propTypes = propTypes;

Article.defaultProps = defaultProps;

export default Article;