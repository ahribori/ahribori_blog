import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import {Grid, Cell, Card, CardTitle, CardText, CardActions, Button, Textfield, Icon} from 'react-mdl';
import { getArticleRequest, removeArticleRequest } from 'actions/article';
import { setEditorModeModify } from 'actions/app';

class Article extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isAuthor: false
		};

		this.handleClickModify = this.handleClickModify.bind(this);
		this.handleClickRemove = this.handleClickRemove.bind(this);
	}

	handleClickModify() {
		browserHistory.push('/editor?mode=modify&id=' + this.props.article._id);
	}

	handleClickRemove() {
		if (confirm('정말 삭제하시겠습니까?')) {
			this.props.removeArticleRequest(this.props.user.token, this.props.article._id)
				.then(() => {
					browserHistory.push('/');
				})
		}
	}

	render() {

		const articleMenu = (
			<div className="article_menu">
				<span className="article_modify_btn" onClick={this.handleClickModify}>수정</span>
				<span> | </span>
				<span className="article_remove_btn" onClick={this.handleClickRemove}>삭제</span>
			</div>
		);

		return (
			<Grid className="article_grid">
				<Cell offsetDesktop={2} col={8} phone={12} tablet={12} style={{ minWidth: '300px' }}>
					<Card shadow={0} style={{
						width: '100%'
					}}>
						<div className="article_container">
							<CardTitle className="article_title" expand>{this.props.article.title}</CardTitle>
							<div className="article_info">
								{this.props.article.author_nickname} | { this.props.article.reg_date } | 조회 {this.props.article.hit} | 추천 {this.props.article.star} | 댓글 {this.props.article.reply_count}
								{ this.state.isAuthor ? articleMenu : '' }
							</div>
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
				/* Prism force initialize */
				Prism.highlightAll();

                const author_id = this.props.article ? this.props.article.author_id : null;
                const user_id = this.props.user ? this.props.user._id : null;
                const isAdmin = this.props.user ? this.props.user.admin : null;

                // 꽌리자이거나 자신이 쓴 글일 때 수정/삭제 버튼 보여줌
                if ((author_id && user_id) || isAdmin) {
                    this.setState({
                        isAuthor: true
                    });
                }
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
		},
        removeArticleRequest: (token, id) => {
			return dispatch(removeArticleRequest(token, id));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);