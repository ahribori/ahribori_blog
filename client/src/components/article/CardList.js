import React, { Component, PropTypes } from 'react';
import {Grid, Cell, Card, CardTitle, CardText, Icon} from 'react-mdl';
import TimeAgo from 'react-timeago';
import { Link, browserHistory } from 'react-router';
import koreanStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import * as colors from 'material-ui/styles/colors';
const formatter = buildFormatter(koreanStrings);
import Pagination from 'material-ui-pagination';

const propTypes = {
	articles: React.PropTypes.array
};

const defaultProps = {
    articles: [],
};

class CardList extends React.Component {

	constructor(props) {
		super(props);
        this.state = {
            total: 16,
            display: 7,
            number: 7
        };
        this.onPageChange = this.onPageChange.bind(this);
	}


    onPageChange(page) {
	    browserHistory.push(window.location.pathname + '?page=' + page);
    }

    componentDidMount() {
        this.palette = [];
        for (let key in colors) {
            if (colors.hasOwnProperty(key)) {
                if(/[^A]700$/.test(key)) {
                    this.palette.push(colors[key]);
                }
            }
        }

    }

    componentDidUpdate() {
        document.querySelector('.mdl-layout__content').scrollTop = 0;
    }

    render() {

        const getRandomColor = () => {
            if (this.palette) {
                return this.palette[Math.floor(Math.random() * this.palette.length)];
            }
        };

        const item = {
            cell: {
                col: 3,
                tablet: 4,
                phone: 6
            }
        };

        const generateArticleCards = (list) => {
            return list.map((article, index) => {
                const cardContent = (
                    <div>
                        <CardText className="article_preview">
                            {article.preview}
                        </CardText>
                        <CardText>
                            <TimeAgo className="article_timeago" date={article.reg_date} formatter={formatter}/>
                        </CardText>
                        <div className="card-bottom">
                            <span className="item-author">{article.author_nickname}</span>
                            <span className="item-bottom-right">
								<span className="item-value reply">댓글 {article.reply.length}</span>
								<span className="item-value">|</span>
								<span className="item-value hit">조회 {article.hit}</span>
							</span>
                        </div>
                    </div>
                );


                return (
                    <Cell key={index} className="grid-item item-hover-effect" col={item.cell.col} phone={item.cell.phone}
                          tablet={item.cell.tablet}>
                        <Link to={`/article/${article._id}`}>
                            <Card shadow={0} className="item-card">
                                <div className="card-top">
                                    <Icon className="item-star" name="star"/>
                                    <span className="item-value">{article.star}</span>
                                </div>
                                <CardTitle expand
                                           className="card_title"
                                           style={{
                                               height: '200px',
                                               backgroundImage: `url(${ article.thumbnail_image || '' })`,
                                               backgroundColor: getRandomColor() }}>{article.title}</CardTitle>
                                {cardContent}
                            </Card>
                        </Link>
                    </Cell>
                )
            })
        };

        const renderPagenation = () => {
            if (this.props.page) {
                return (
                    <div className="pagination">
                        <Pagination
                            total={this.props.page.pageCount}
                            current={this.props.page.currentPage}
                            display={this.props.page.pageGroupSize}
                            onChange={this.onPageChange}
                        />
                    </div>
                )
            } else {
                return '';
            }
        };

        return (
            <div>
                <Grid className="home_grid" noSpacing={true}>
                    {generateArticleCards(this.props.articles)}
                </Grid>
                {renderPagenation()}
            </div>
        );
	}

}

CardList.propTypes = propTypes;

CardList.defaultProps = defaultProps;

export default CardList;