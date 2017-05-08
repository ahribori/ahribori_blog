import React, { Component, PropTypes } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Grid, Cell, Card, CardTitle } from 'react-mdl';
import { getArticleRequest, removeArticleRequest } from '../actions/article';
import { registerCommentRequest, modifyCommentRequest, removeCommentRequest } from '../actions/comments';
import { getCategoryRequest } from '../actions/category';
import { Comments, Share } from '../components';

class Article extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isAuthor: false,
			fetchComplete: false,
		};

		this.handleClickModify = this.handleClickModify.bind(this);
		this.handleClickRemove = this.handleClickRemove.bind(this);
	}

    static fetchDataServerSide({ store, params, history }) {
        const article_id = params.id;
        return store.dispatch(getArticleRequest(article_id))
    }

	handleClickModify() {
        this.props.getCategoryRequest(this.props.user.token);
		browserHistory.push('/editor?mode=modify&id=' + this.props.article._id);
	}

	handleClickRemove() {
		if (confirm('정말 삭제하시겠습니까?')) {
			this.props.removeArticleRequest(this.props.user.token, this.props.article._id)
				.then(() => {
                    this.props.getCategoryRequest(this.props.user.token);
					browserHistory.push('/');
				})
		}
	}

    componentDidMount() {
        const id = this.props.params.id;
		const sessionStarageHits = sessionStorage.getItem('ahribori_hits');
		const hits = sessionStarageHits ? sessionStarageHits.split('|') : [];
		let upHits = 0;
		if (hits.indexOf(id) === -1) {
			sessionStorage.setItem('ahribori_hits', `${sessionStarageHits}|${id}`);
			upHits = 1;
		}

		const token = this.props.user ? this.props.user.token : null;
        this.props.getArticleRequest(id, token, upHits)
            .then(() => {
        		/* remove loader */
                const loadingElement =  document.getElementById('loading');
                if (loadingElement) {
                    loadingElement.remove ? loadingElement.remove() : loadingElement.removeNode(true);
                    $('#article_grid').css('visibility', 'visible');
                }
                
				/* Prism force initialize */
				const preTags = $('pre');
				if (!preTags.hasClass('line-numbers')) { preTags.addClass('line-numbers') }
                Prism.highlightAll();

                const author_id = this.props.article ? this.props.article.author_id : null;
                const user_id = this.props.user ? this.props.user._id : null;
                const isAdmin = this.props.user ? this.props.user.admin : null;

                // 꽌리자이거나 자신이 쓴 글일 때 수정/삭제 버튼 보여줌
                if ((author_id === user_id) || isAdmin) {
                    this.setState({
                        isAuthor: true
                    });
                }

                this.setState({
                	fetchComplete: true
				});
            });
        const searchInput = document.getElementById('textfield-Search');
        if (searchInput.blur) searchInput.blur();
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
            <div>
                <Helmet>
					<meta name="description" content={this.props.article.preview} />
					<meta name="keywords" content="JavaScript,Node.js,Java,React,HTML,CSS" />
					<meta name="author" content={this.props.article.author_nickname} />
					<meta property="og:title" content={ this.props.article.title } />
					<meta property="og:description" content={this.props.article.preview} />
					<meta property="og:image" content={this.props.article.thumbnail_image ? this.props.article.thumbnail_image : '/favicon/cats.png'} />
                    <title>{this.props.article.title ? `${this.props.article.title} :: Ahribori's Blog` : `Ahribori's Blog`}</title>
                </Helmet>
                <Grid id="article_grid" className="article_grid">
                    <Cell offsetDesktop={2} col={8} phone={12} tablet={12} style={{ minWidth: '300px' }}>
                        <Card shadow={0} style={{
                            width: '100%'
                        }}>
                            <div className="article_container">
                                <CardTitle className="article_title" expand>{this.props.article.title}</CardTitle>
                                <div className="article_info">
                                    { this.props.article.author_nickname} | { this.props.article.reg_date } | 조회 {this.props.article.hit} | 추천 {this.props.article.star} | 댓글 {this.props.article.comments_count}
                                    { this.state.isAuthor ? articleMenu : '' }
                                </div>
                                <hr/>
                                <div className="article_content" dangerouslySetInnerHTML={{ __html: this.props.article.content }}></div>
                                {this.state.fetchComplete ? <Share url={location.href}
                                                                   description={this.props.article.preview}
                                                                   picture={this.props.article.thumbnail_image ? this.props.article.thumbnail_image : ''}
                                                                   title={this.props.article.title}/> : ''}
                            </div>
                        </Card>
                        {this.state.fetchComplete ? (
                                <Comments data={this.props.comments}
                                          comments={this.props.comments_state}
                                          refArticle={this.props.params.id}
                                          user={this.props.user}
                                          redirected={this.props.location.query.redirected}
                                          registerRequest={this.props.registerCommentRequest}
                                          modifyRequest={this.props.modifyCommentRequest}
                                          removeRequest={this.props.removeCommentRequest}
                                          getArticleRequest={this.props.getArticleRequest}
                                          location={this.props.location}
                                />
                            ) : ''}

                    </Cell>
                </Grid>
				<div id="loading" className='tetrominos'>
					<div className='tetromino box1'></div>
					<div className='tetromino box2'></div>
					<div className='tetromino box3'></div>
					<div className='tetromino box4'></div>
				</div>
            </div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		article: state.article.article.data,
		comments: state.article.article.comments,
		comments_state: state.comment,
		user: state.authentication.user,
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getArticleRequest: (id, token, upHits) => {
			return dispatch(getArticleRequest(id, token, upHits));
		},
        removeArticleRequest: (token, id) => {
			return dispatch(removeArticleRequest(token, id));
		},
        getCategoryRequest: (token) => {
            return dispatch(getCategoryRequest(token));
        },
		registerCommentRequest: (token, data) => {
			return dispatch(registerCommentRequest(token, data));
		},
        modifyCommentRequest: (token, data) => {
            return dispatch(modifyCommentRequest(token, data));
        },
		removeCommentRequest: (token, id) => {
			return dispatch(removeCommentRequest(token, id));
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);