import React, { Component, PropTypes } from 'react';
import {Grid, Cell, Card, CardTitle, CardText, Icon} from 'react-mdl';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router';
import koreanStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import * as colors from 'material-ui/styles/colors';
const formatter = buildFormatter(koreanStrings);

const propTypes = {
	articles: React.PropTypes.array
};

const defaultProps = {
    articles: []
};

class CardList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

		};
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

    componentWillReceiveProps() {

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

        return (
            <div>
                <Grid className="home_grid" noSpacing={true}>
                    {generateArticleCards(this.props.articles)}
                </Grid>
            </div>
        );
	}

}

CardList.propTypes = propTypes;

CardList.defaultProps = defaultProps;

export default CardList;