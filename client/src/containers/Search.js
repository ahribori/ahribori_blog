import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from 'actions/authentication';
import { getArticleListRequest } from 'actions/article';
import config from '../config';
import { CardList } from 'components';

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.fetchArticle = this.fetchArticle.bind(this);
    }

    fetchArticle(search) {
        const token = localStorage.getItem('ahribori_token');
        this.props.getArticleRequest(token, { offset: 0, limit: 25, search })
            .then(() => {
                if (this.props.articleList.error && this.props.articleList.error.status === 403) {
                    localStorage.removeItem('ahribori_token');
                    this.props.logout();
                    this.props.getArticleRequest(config.token, { offset: 0, limit: 25, search })
                }
            })
    }

    componentDidMount() {
        this.fetchArticle(this.props.params.search);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.fetchArticle(nextProps.params.search);
        }
    }

    render() {
        const noSearchResult = (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h3 style={{ fontFamily: 'iropkeBatangM' }}>검색어 '{this.props.params.search}'에 해당하는 게시물이 존재하지 않습니다.</h3>
            </div>
        );
        return (
            <div>
                { this.props.articleList.data.length === 0 ? noSearchResult : ''}
                <CardList articles={this.props.articleList.data}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Search);