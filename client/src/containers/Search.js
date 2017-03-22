import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions/authentication';
import { getArticleListRequest } from '../actions/article';
class Search extends React.Component {

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
        const search = params.search;
        return store.dispatch(getArticleListRequest(null, { offset, limit, search }));
    }

    fetchArticle(search, page = 1) {
        const token = localStorage.getItem('ahribori_token');
        const limit = 12;
        const offset = limit * (page -1);
        this.props.getArticleRequest(token, { offset, limit, search })
            .then(() => {
                if (this.props.articleList.error && this.props.articleList.error.status === 403) {
                    localStorage.removeItem('ahribori_token');
                    this.props.logout();
                    this.props.getArticleRequest(process.env.TOKEN, { offset, limit, search })
                }
                this.setState({
                    message: `검색어 '${this.props.params.search}'에 해당하는 게시물이 존재하지 않습니다.`
                })
            })
    }

    componentDidMount() {
        const page = this.props.location.query.page ? this.props.location.query.page : 1;
        this.fetchArticle(this.props.params.search, page);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.fetchArticle(nextProps.params.search);
        }
        if (this.props.location.query.page !== nextProps.location.query.page) {
            this.fetchArticle(nextProps.params.search, nextProps.location.query.page);
        }
    }

    render() {
        const noSearchResult = (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h3 style={{ fontFamily: 'iropkeBatangM' }}>{this.state.message}</h3>
            </div>
        );
        return (
            <div>
                { this.props.articleList.data.length === 0 ? noSearchResult : ''}
                <CardList articleList={this.props.articleList} page={this.props.articleList.page}/>
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