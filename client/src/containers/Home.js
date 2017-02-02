import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {Grid, Cell, Card, CardTitle, CardText, CardActions, Button, Icon} from 'react-mdl';
import Masonry from 'masonry-layout';
import { getArticleListRequest } from 'actions/article';
import TimeAgo from 'react-timeago';
import koreanStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
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

		this.props.getArticleRequest(0, 25)
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

		const offset = '8px';

		const bigItem = {
			cell: {
				col: 6,
				tablet: 12,
				phone: 12,
				style: {
					padding: offset
				}
			}
		};

		const item = {
			cell: {
				col: 3,
				tablet: 4,
				phone: 6,
				style: {
					padding: offset
				}
			}
		};

		const generateArticleCards = (list) => {
			return list.map((article, index) => {

				const cardContent = (
					<div>
						<CardText className="article_content">
							{article._id}
							{article.content}...
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
						<Cell key={index} className="grid-item" col={bigItem.cell.col} phone={bigItem.cell.phone} tablet={bigItem.cell.tablet} style={bigItem.cell.style}>
							<Card shadow={0} className="big-item-card">
								<CardTitle expand style={{background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>{article.title}</CardTitle>
								{cardContent}
							</Card>
						</Cell>
					)
				} else {
					return (
						<Cell key={index} className="grid-sizer grid-item" col={item.cell.col} phone={item.cell.phone} tablet={item.cell.tablet} style={item.cell.style}>
							<Card shadow={0} className="item-card">
								<CardTitle expand style={{minHeight:'100px', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>{article.title}</CardTitle>
								{cardContent}
							</Card>
						</Cell>
					)
				}

			})
		};


		return (
			<div>
				<Grid className="grid" noSpacing={true} style={{ margin: offset }}>
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
		getArticleRequest: (offset, limit) => {
			return dispatch(getArticleListRequest(offset, limit));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);