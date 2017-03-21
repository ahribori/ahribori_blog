import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions/authentication';
import { getArticleListRequest } from '../actions/article';
import config from '../config';
import { CardList } from '../components';

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			message: '불러오는 중...'
		};
		this.fetchArticle = this.fetchArticle.bind(this);
	}

    static fetchDataServerSide({ store, params, history }) {
		const page = params.page ? params.page : 1;
		const limit = 12;
		const offset = limit * (page -1);
		const category = params.id;
		return store.dispatch(getArticleListRequest(null, { offset, limit, category }));
    }

    fetchArticle(page = 1) {
        const token = localStorage.getItem('ahribori_token');
        const limit = 12;
        const offset = limit * (page -1);
        this.props.getArticleRequest(token, { offset, limit })
            .then(() => {
                if (this.props.articleList.error && this.props.articleList.error.status === 403) {
                    localStorage.removeItem('ahribori_token');
                    this.props.logout();
                    this.props.getArticleRequest(config.token, { offset, limit })
                }
                this.setState({
                	message: '게시물이 존재하지 않습니다.'
				})
            })
    }

	componentDidMount() {
        const page = this.props.location.query.page ? this.props.location.query.page : 1;
        this.fetchArticle(this.props.location.query.page, page);
	}

	componentWillReceiveProps(nextProps) {
        if (this.props.location.query.page !== nextProps.location.query.page) {
            this.fetchArticle(nextProps.location.query.page);
        }
	}

	render() {
        const noArticles = (
			<div style={{ textAlign: 'center', marginTop: '20px' }}>
				<h3 style={{ fontFamily: 'iropkeBatangM' }}>{this.state.message}</h3>
			</div>
        );
		return (
			<div>
				{ this.props.articleList.data.length === 0 ? noArticles : ''}
				<CardList
					onPageChange={this.onPageChange}
					articleList={this.props.articleList}
					page={this.props.articleList.page}
				/>
			</div>
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
		getArticleRequest: (token, query) => {
			return dispatch(getArticleListRequest(token, query));
		},
        logout: () => {
            return dispatch(logout());
        }
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);