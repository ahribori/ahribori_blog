import React, { Component, PropTypes } from 'react';
import { Grid, Cell, Card } from 'react-mdl';
import { connect } from 'react-redux';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
	from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import ModifyIcon from 'material-ui/svg-icons/content/create';
import RemoveIcon from 'material-ui/svg-icons/content/clear';
import AddIcon from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import $ from 'jquery';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widgets/sortable';
import update from 'react-addons-update';

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
			categories: [],
			dialog: {
            	open: false,
				mode: 'REGISTER',
				title: '',
                body: '',
				category_name: ''
            }
		};
		this.syncCategories = this.syncCategories.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleOpenRegister = this.handleOpenRegister.bind(this);
		this.handleOpenModify = this.handleOpenModify.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	syncCategories(callback) {
		this.props.getCategoryRequest(this.props.user.token)
			.then(() => {
				this.setState({
					categories:	this.props.get.response.response
				});
				if (typeof callback === 'function') { callback(); }
			})
	}

	handleChange(e) {
		this.setState(update(this.state, {
			dialog: {
				category_name: { $set: e.target.value }
			}
		}));
	}

    handleOpenRegister() {
        this.setState({
            dialog: {
                open: true,
                mode: 'REGISTER',
                title: '카테고리 만들기',
				category_name: ''
            }
        });
    };

    handleOpenModify(e) {
    	const category_index = e.target.dataset.index ? e.target.dataset.index : e.target.parentNode.dataset.index;
    	const targetCategory = this.state.categories[category_index];
        this.setState({
            dialog: {
                open: true,
                mode: 'MODIFY',
                title: '카테고리 수정',
				category_id: targetCategory._id,
				category_name: targetCategory.name
            }
        });
    };

    handleSubmit() {
    	if (this.state.dialog.mode === 'REGISTER') {
    		this.props.registerCategoryRequest({
    			name: this.state.dialog.category_name
			}, this.props.user.token)
				.then(() => {
					this.syncCategories();
				})

		} else if (this.state.dialog.mode === 'MODIFY') {
            this.props.modifyCategoryRequest({
            	_id: this.state.dialog.category_id,
                name: this.state.dialog.category_name
            }, this.props.user.token)
                .then(() => {
                    this.syncCategories();
                })
		}
		this.setState({
			dialog: {
				open: false
			}
		})
	}

	handleRemove(e) {
        const category_index = e.target.dataset.index ? e.target.dataset.index : e.target.parentNode.dataset.index;
        const targetCategory = this.state.categories[category_index];
        if(confirm(`${targetCategory.name} 카테고리와 해당 카테고리의 게시물이 모두 삭제됩니다.`)) {
        	this.props.removeCategoryRequest({ _id: targetCategory._id }, this.props.user.token)
				.then(() => {
                    this.syncCategories();
				});
				this.setState({
					dialog: {
						open: false
					}
				})
		}
	}

    handleClose() {
        this.setState({
            dialog: {
                open: false
            }
        });
    };

	componentDidMount() {
		const Sortable = $( "#category_sortable" );

		this.syncCategories(() => {

            Sortable.sortable();
            Sortable.on('sortupdate', (event, ui) => {
                const target = ui.item;
                const prev_target = $(target[0].previousSibling);
                const category_id = target.attr('data-id');
                const prev_order = prev_target.attr('data-order') ? prev_target.attr('data-order') : -1;
                const prev_name = target.attr('data-index');
                console.log(this.state.categories[target.attr('data-index')].name + '을 ' + this.state.categories[prev_order].name + ' 다음으로 ㅋㅋ');
                console.log(category_id, prev_order);
                this.props.modifyCategoryRequest({
                    _id: category_id,
					prev_order
                }, this.props.user.token)
                    .then(() => {
                        this.syncCategories();
                    })
            });

		});
	}

	componentWillReceiveProps(nextProps) {

	}

	render() {
		const listToComponents = (list) => {
			return list.map((category, index) => {
				return (
					<Card key={index} shadow={0} className="category_card" data-id={category._id} data-index={index} data-order={category.order}>
						<div className="category_values">
							<span className="category_name">{category.name}</span>
							<span className="category_count">({category.count})</span>
						</div>
						<span className="category_buttons" >
							<IconButton><RemoveIcon onClick={this.handleRemove} data-index={index} /></IconButton>
							<IconButton ><ModifyIcon onClick={this.handleOpenModify} data-index={index} /></IconButton>
						</span>
					</Card>
				);
			})
		};

        const actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.handleClose}
			/>,
			<FlatButton
				label="Submit"
				primary={true}
				onTouchTap={this.handleSubmit}
			/>,
        ];

		return (
			<div>
				<Grid className="category_grid">
					<Cell offsetDesktop={2} col={8} phone={12} tablet={12} style={{ minWidth: '300px' }}>
						<div id="category_sortable">
							{listToComponents(this.state.categories)}
						</div>
						<Card shadow={0} className="category_card category_add" onClick={this.handleOpenRegister}>
							<div className="add_icon" >카테고리 만들기<AddIcon/></div>
						</Card>
					</Cell>
				</Grid>
				<Dialog
					title={this.state.dialog.title}
					actions={actions}
					modal={true}
					open={this.state.dialog.open}
					onRequestClose={this.handleClose} >
					<TextField id="category_name_input" fullWidth={true} hintText="카테고리 이름" onChange={this.handleChange} value={this.state.dialog.category_name}/>
				</Dialog>
			</div>
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