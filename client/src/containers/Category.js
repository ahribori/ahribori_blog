import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { logout } from '../actions/authentication';
import { getArticleListRequest } from '../actions/article';
import { CardList } from '../components';

class Category extends React.Component {

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

    fetchArticle(category, page = 1) {
        const token = localStorage.getItem('ahribori_token');
        const limit = 12;
        const offset = limit * (page -1);
        this.props.getArticleRequest(token, { offset, limit, category })
            .then(() => {
                if (this.props.articleList.error && this.props.articleList.error.status === 403) {
                    localStorage.removeItem('ahribori_token');
                    this.props.logout();
                    this.props.getArticleRequest(process.env.TOKEN, { offset, limit, category })
                }
                this.setState({
                    message: '이 카테고리에 해당하는 게시물이 존재하지 않습니다.'
                })
            })
    }

    componentDidMount() {
        const page = this.props.location.query.page ? this.props.location.query.page : 1;
        this.fetchArticle(this.props.params.id, page);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.fetchArticle(nextProps.params.id);
        }
        if (this.props.location.query.page !== nextProps.location.query.page) {
            this.fetchArticle(nextProps.params.id, nextProps.location.query.page);
        }
    }

    render() {
        const noCategoryResult = (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h3 style={{ fontFamily: 'iropkeBatangM' }}>{this.state.message}</h3>
            </div>
        );

        const category =  this.props.category.response ? this.props.category.response.response.find((list) => list._id === this.props.params.id) : null;
        return (
            <div>
                <Helmet>
                    <title>{category ? `${category.name} :: Ahribori's Blog` : `Ahribori's Blog`}</title>
                </Helmet>
                { this.props.articleList.data.length === 0 ? noCategoryResult : ''}
                <CardList onPageChange={this.onPageChange} articleList={this.props.articleList} page={this.props.articleList.page}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        articleList: state.article.articleList,
        category: state.category.get
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