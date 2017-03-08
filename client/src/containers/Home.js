import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from 'actions/authentication';
import { getArticleListRequest } from 'actions/article';
import config from '../config';
import { CardList } from 'components';

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			articles: []
		};
		this.fetchArticles = this.fetchArticles.bind(this);
	}

	fetchArticles() {
		const token = localStorage.getItem('ahribori_token');

		const setArticleListToState = () => {
			if (!this.props.articleList.error) {
				this.setState({
					articles: this.props.articleList.data
				});
			}
		};

		this.props.getArticleRequest(0, 25, token)
			.then(() => {
				if (this.props.articleList.error && this.props.articleList.error.status === 403) {
					localStorage.removeItem('ahribori_token');
					this.props.logout();
					this.props.getArticleRequest(0, 25, config.TOKEN)
						.then(() => {
							setArticleListToState();
						})
				} else {
					setArticleListToState();
				}
			})

	}

	componentDidMount() {
		this.fetchArticles();
	}

	render() {
		return (
			<CardList articles={this.props.articleList.data}/>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		articleList: state.article.articleList
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getArticleRequest: (offset, limit, token) => {
			return dispatch(getArticleListRequest(offset, limit, token));
		},
        logout: () => {
            return dispatch(logout());
        }
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);