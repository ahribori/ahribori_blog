import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from 'actions/authentication';
import { getArticleListRequest } from 'actions/article';
import config from '../config';
import { CardList } from 'components';

class Category extends React.Component {

    constructor(props) {
        super(props);
        this.fetchArticle = this.fetchArticle.bind(this);
    }

    fetchArticle(category) {
        const token = localStorage.getItem('ahribori_token');
        this.props.getArticleRequest(token, { offset: 0, limit: 25, category })
            .then(() => {
                if (this.props.articleList.error && this.props.articleList.error.status === 403) {
                    localStorage.removeItem('ahribori_token');
                    this.props.logout();
                    this.props.getArticleRequest(config.token, { offset: 0, limit: 25, category })
                }
            })
    }

    componentDidMount() {
        this.fetchArticle(this.props.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.fetchArticle(nextProps.params.id);
        }
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
        getArticleRequest: (token, query) => {
            return dispatch(getArticleListRequest(token, query));
        },
        logout: () => {
            return dispatch(logout());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);