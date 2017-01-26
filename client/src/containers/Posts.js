import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {Grid, Cell, Card, CardTitle, CardText, CardActions, Button} from 'react-mdl';
import Masonry from 'masonry-layout';

const propTypes = {};

const defaultProps = {};

class Posts extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		const masonry = new Masonry( '.grid', {
			columnWidth: '.grid-sizer',
			itemSelector: '.grid-item',
			percentPosition: true,
		});
	}

	render() {

		const offset = '8px';

		const bigItem = {
			style: {
				padding: offset
			},
			layout: {
				col: 6,
				tablet: 12,
				phone: 12
			}
		};

		const item = {
			style: {
				padding: offset
			},
			layout: {
				col: 3,
				tablet: 4,
				phone: 6
			}
		};

		return (
			<div>
				<Grid className="grid" noSpacing={true} style={{ margin: offset }}>


						<Cell className="grid-item" col={bigItem.layout.col} phone={bigItem.layout.phone} tablet={bigItem.layout.tablet} style={bigItem.style}>
							<Card shadow={0} style={{width: '100%', height: '520px'}}>
								<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
								<CardText>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Aenan convallis.
								</CardText>
								<CardActions border>
									<Button colored>View Updates</Button>
								</CardActions>
							</Card>
						</Cell>
						<Cell className="grid-sizer grid-item" col={item.layout.col} phone={item.layout.phone} tablet={item.layout.tablet} style={item.style}>
							<Card shadow={0} style={{width: '100%', height: '420px'}}>
								<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
								<CardText>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Aenan convallis.
								</CardText>
								<CardActions border>
									<Button colored>View Updates</Button>
								</CardActions>
							</Card>
						</Cell>
						<Cell className="grid-sizer grid-item" col={item.layout.col} phone={item.layout.phone} tablet={item.layout.tablet} style={item.style}>
							<Card shadow={0} style={{width: '100%', height: '720px'}}>
								<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
								<CardText>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Aenan convallis.
								</CardText>
								<CardActions border>
									<Button colored>View Updates</Button>
								</CardActions>
							</Card>
						</Cell>
						<Cell className="grid-sizer grid-item" col={item.layout.col} phone={item.layout.phone} tablet={item.layout.tablet} style={item.style}>
							<Card shadow={0} style={{width: '100%', height: '420px'}}>
								<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
								<CardText>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Aenan convallis.
								</CardText>
								<CardActions border>
									<Button colored>View Updates</Button>
								</CardActions>
							</Card>
						</Cell>
						<Cell className="grid-sizer grid-item" col={item.layout.col} phone={item.layout.phone} tablet={item.layout.tablet} style={item.style}>
							<Card shadow={0} style={{width: '100%', height: '360px'}}>
								<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
								<CardText>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Aenan convallis.
								</CardText>
								<CardActions border>
									<Button colored>View Updates</Button>
								</CardActions>
							</Card>
						</Cell>
						<Cell className="grid-sizer grid-item" col={item.layout.col} phone={item.layout.phone} tablet={item.layout.tablet} style={item.style}>
							<Card shadow={0} style={{width: '100%', height: '420px'}}>
								<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
								<CardText>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Aenan convallis.
								</CardText>
								<CardActions border>
									<Button colored>View Updates</Button>
								</CardActions>
							</Card>
						</Cell>
						<Cell className="grid-sizer grid-item" col={item.layout.col} phone={item.layout.phone} tablet={item.layout.tablet} style={item.style}>
							<Card shadow={0} style={{width: '100%', height: '420px'}}>
								<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
								<CardText>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Aenan convallis.
								</CardText>
								<CardActions border>
									<Button colored>View Updates</Button>
								</CardActions>
							</Card>
						</Cell>
						<Cell className="grid-sizer grid-item" col={item.layout.col} phone={item.layout.phone} tablet={item.layout.tablet} style={item.style}>
							<Card shadow={0} style={{width: '100%', height: '420px'}}>
								<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
								<CardText>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Aenan convallis.
								</CardText>
								<CardActions border>
									<Button colored>View Updates</Button>
								</CardActions>
							</Card>
						</Cell>
						<Cell className="grid-sizer grid-item" col={item.layout.col} phone={item.layout.phone} tablet={item.layout.tablet} style={item.style}>
							<Card shadow={0} style={{width: '100%', height: '420px'}}>
								<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
								<CardText>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Aenan convallis.
								</CardText>
								<CardActions border>
									<Button colored>View Updates</Button>
								</CardActions>
							</Card>
						</Cell>
						<Cell className="grid-sizer grid-item" col={item.layout.col} phone={item.layout.phone} tablet={item.layout.tablet} style={item.style}>
							<Card shadow={0} style={{width: '100%', height: '420px'}}>
								<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
								<CardText>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Aenan convallis.
								</CardText>
								<CardActions border>
									<Button colored>View Updates</Button>
								</CardActions>
							</Card>
						</Cell>
						<Cell className="grid-sizer grid-item" col={item.layout.col} phone={item.layout.phone} tablet={item.layout.tablet} style={item.style}>
							<Card shadow={0} style={{width: '100%', height: '420px'}}>
								<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
								<CardText>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Aenan convallis.
								</CardText>
								<CardActions border>
									<Button colored>View Updates</Button>
								</CardActions>
							</Card>
						</Cell>
						<Cell className="grid-sizer grid-item" col={item.layout.col} phone={item.layout.phone} tablet={item.layout.tablet} style={item.style}>
							<Card shadow={0} style={{width: '100%', height: '420px'}}>
								<CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
								<CardText>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Aenan convallis.
								</CardText>
								<CardActions border>
									<Button colored>View Updates</Button>
								</CardActions>
							</Card>
						</Cell>


				</Grid>
			</div>
		);
	}
}

Posts.propTypes = propTypes;

Posts.defaultProps = defaultProps;

const mapStateToProps = (state) => {
	return {
		status: state.authentication.register.status,
		error: state.authentication.register.error
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		registerRequest: (id, pw) => {
			return dispatch(registerRequest(id, pw));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);