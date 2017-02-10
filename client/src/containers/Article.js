import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Grid, Cell, Card, CardTitle, CardText, CardActions, Button, Textfield, Icon} from 'react-mdl';
import { getArticleRequest } from 'actions/article';

class Article extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Grid className="article_grid">
				<Cell offsetDesktop={2} col={8} phone={12} tablet={12} style={{ minWidth: '300px' }}>
					<Card shadow={0} style={{
						width: '100%'
					}}>
						<div className="article_container">
							<CardTitle className="article_title" expand>{this.props.article.title}</CardTitle>
							<div className="article_info">{this.props.article.author} | { this.props.article.reg_date } | 조회 {this.props.article.hit} | 추천 {this.props.article.star} | 댓글 {this.props.article.reply_count}</div>
							<hr/>
							<div className="article_content" dangerouslySetInnerHTML={{ __html: this.props.article.content }}></div>
						</div>
					</Card>
				</Cell>
			</Grid>
		);
	}

	componentDidMount() {
		const id = this.props.params.id;
		this.props.getArticleRequest(id)
			.then(() => {
				Prism.highlightAll();
			})
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

const mapStateToProps = (state) => {
	return {
		article: state.article.article.data,
		user: state.authentication.user,
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getArticleRequest: (id, token) => {
			return dispatch(getArticleRequest(id, token));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);