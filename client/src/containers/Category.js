import React, { Component, PropTypes } from 'react';
import { Grid, Cell, Card } from 'react-mdl';
import { connect } from 'react-redux';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
	from 'material-ui/Table';
import {
	registerCategoryRequest,
	getCategoryRequest,
	modifyCategoryRequest,
	removeCategoryRequest
} from 'actions/category';

class Category extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			fixedHeader: true,
			fixedFooter: true,
			stripedRows: false,
			showRowHover: false,
			selectable: true,
			multiSelectable: true,
			enableSelectAll: false,
			deselectOnClickaway: true,
			showCheckboxes: true,
			categories: null,
			userExist: false,
		};
		this.triggerGetCategoryRequest = this.triggerGetCategoryRequest.bind(this);
	}

	triggerGetCategoryRequest() {
		this.props.getCategoryRequest(this.props.user.token)
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {

	}

	render() {
		const tableData = [
			{
				name: 'John Smith',
				status: 'Employed',
				selected: true,
			},
			{
				name: 'Randal White',
				status: 'Unemployed',
			},
			{
				name: 'Stephanie Sanders',
				status: 'Employed',
				selected: true,
			},
			{
				name: 'Steve Brown',
				status: 'Employed',
			},
			{
				name: 'Joyce Whitten',
				status: 'Employed',
			},
			{
				name: 'Samuel Roberts',
				status: 'Employed',
			},
			{
				name: 'Adam Moore',
				status: 'Employed',
			},
		];

		return (
			<Grid className="category_grid">
				<Cell offsetDesktop={2} col={8} phone={12} tablet={12} style={{ minWidth: '300px' }}>
					<Card shadow={0} style={{
						width: '100%'
					}}>
						<Table
							fixedHeader={this.state.fixedHeader}
							selectable={this.state.selectable}
							multiSelectable={this.state.multiSelectable}
						>
							<TableHeader
								displaySelectAll={this.state.showCheckboxes}
								adjustForCheckbox={this.state.showCheckboxes}
								enableSelectAll={this.state.enableSelectAll}
							>
								<TableRow>
									<TableHeaderColumn colSpan="3" tooltip="카테고리 관리" style={{textAlign: 'center'}}>
										카테고리 관리
									</TableHeaderColumn>
								</TableRow>
								<TableRow>
									<TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
									<TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
									<TableHeaderColumn tooltip="The Status">Status</TableHeaderColumn>
								</TableRow>
							</TableHeader>
							<TableBody
								displayRowCheckbox={this.state.showCheckboxes}
								deselectOnClickaway={this.state.deselectOnClickaway}
								showRowHover={this.state.showRowHover}
								stripedRows={this.state.stripedRows}
							>
								{tableData.map( (row, index) => (
									<TableRow key={index} selected={row.selected}>
										<TableRowColumn>{index}</TableRowColumn>
										<TableRowColumn>{row.name}</TableRowColumn>
										<TableRowColumn>{row.status}</TableRowColumn>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Card>
				</Cell>
			</Grid>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		user: state.authentication.user,
		register: state.category.register,
		get: state.category.get,
		modify: state.category.modify,
		remove: state.category.remove
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		registerCategoryRequest: (category, token) => {
			return dispatch(registerCategoryRequest(category, token));
		},
		getCategoryRequest: (token) => {
			return dispatch(getCategoryRequest(token));
		},
		modifyCategoryRequest: (category, token) => {
			return dispatch(modifyCategoryRequest(category, token));
		},
		removeCategoryRequest:  (category, token) => {
			return dispatch(removeCategoryRequest(category, token));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);