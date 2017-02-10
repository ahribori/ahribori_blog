import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {Grid, Cell, Card, CardTitle, CardText, CardActions, Button, Icon} from 'react-mdl';
import Masonry from 'masonry-layout';
import { getArticleListRequest } from 'actions/article';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router';
import koreanStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import * as colors from 'material-ui/styles/colors';

const formatter = buildFormatter(koreanStrings);

const propTypes = {};

const defaultProps = {};

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			articles: []
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

		const token = localStorage.getItem('ahribori_token');
		this.props.getArticleRequest(0, 25, token)
			.then(() => {
				if (!this.props.articleList.error) {

					this.setState({
						articles: this.props.articleList.data
					});

					const masonry = new Masonry( '.mdl-layout__content', {
						columnWidth: '.grid-sizer',
						itemSelector: '.grid-item',
						percentPosition: true
					});

				}
			})
	}

	render() {

		const getRandomColor = () => {
			return this.palette[Math.floor(Math.random() * this.palette.length)];
		};

		const bigItem = {
			cell: {
				col: 6,
				tablet: 12,
				phone: 12
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
						<CardText className="article_content">
							{article.preview}
						</CardText>
						<CardText>
							<TimeAgo className="article_timeago" date={article.reg_date} formatter={formatter}/>
						</CardText>
						<CardActions border>
							<Button colored>더 보기...</Button>
						</CardActions>
					</div>
				);

				if (index === 0) {
					return (
						<Cell key={index} className="grid-item" col={bigItem.cell.col} phone={bigItem.cell.phone}
							  tablet={bigItem.cell.tablet}>
							<Link to={`/article/${article._id}`}>
								<Card shadow={0} className="big-item-card">
									<CardTitle expand
											   style={{background: 'url(https://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat' +
											   getRandomColor() }}>{article.title}</CardTitle>
									{cardContent}
								</Card>
							</Link>
						</Cell>
					)
				} else {
					return (
						<Cell key={index} className="grid-sizer grid-item" col={item.cell.col} phone={item.cell.phone}
							  tablet={item.cell.tablet}>
							<Link to={`/article/${article._id}`}>
								<Card shadow={0} className="item-card">
									<CardTitle expand style={{
										height: '200px',
										background: 'url(https://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat' +
										getRandomColor() }}>{article.title}</CardTitle>
									{cardContent}
								</Card>
							</Link>
						</Cell>
					)
				}

			})
		};


		return (
			<div>
				<Grid className="home_grid" noSpacing={true}>
						{generateArticleCards(this.state.articles)}
				</Grid>
			</div>
		);
	}
}

Home.propTypes = propTypes;

Home.defaultProps = defaultProps;

const mapStateToProps = (state) => {
	return {
		articleList: state.article.articleList
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getArticleRequest: (offset, limit, token) => {
			return dispatch(getArticleListRequest(offset, limit, token));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);