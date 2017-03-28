import React, { Component, PropTypes } from 'react';
import { Card, Icon, IconButton, FABButton, Textfield } from 'react-mdl';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import CommentArrowIcon from 'material-ui/svg-icons/navigation/subdirectory-arrow-right';
import TimeAgo from 'react-timeago';
import koreanStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
const formatter = buildFormatter(koreanStrings);
const propTypes = {};

const defaultProps = {};

class Comments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialog: {
                open: false
            },
            comments: '',
        };
        this.handleClickAddButton = this.handleClickAddButton.bind(this);
        this.handleDialogOpen = this.handleDialogOpen.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
    }
    
    handleClickAddButton(e) {
        e.preventDefault();
        this.handleDialogOpen();
    }

    handleDialogOpen() {
        this.setState({
            dialog: {
                open: true
            }
        })
    }

    handleDialogClose() {
        this.setState({
            dialog: {
                open: false
            }
        })
    }

    handleSubmit() {
        console.log('submit');
        this.setState({
            dialog: {
                open: false
            }
        })
    }

    render() {
        const mapToComponents = (list) => {
            return list.map((comment, index, comments) => {
                const social_icon = `/image/${comment.author.login_type}_icon.png`;
                const hasRef = comment._id !== comment.ref_comment;

                if (!hasRef) { // 일반
                    return (
                        <Card id={`comments_${index}`} key={index} shadow={0} className="comments_container">
                            <div className="comments_header">
                                <Avatar className="comments_thumbnail" src={comment.author.thumbnail_image} size={50} />
                                <img className="comments_social_icon" src={social_icon} width={25} height={25}/>
                                <span className="comments_nickname">{comment.author.nickname}</span>
                                <TimeAgo className="comments_timeago" date={comment.reg_date} formatter={formatter}/>
                                <IconButton className="comments_menu" name="grade"/>
                            </div>
                            <div className="comments_body">
                                <p className="comments_comments">{comment.comments}</p>
                            </div>
                        </Card>
                    )
                } else { // 덧글의 덧글
                    const ref_comments = comments.find(comments => comments._id === comment.ref_comment);
                    const ref_comments_social_icon = `/image/${ref_comments.author.login_type}_icon.png`;
                    return (
                        <Card id={`comments_${index}`} key={index} shadow={0} className="comments_container child">
                            <CommentArrowIcon className="comments_child_icon"/>
                            <div className="comments_header">
                                <Avatar className="comments_thumbnail" src={comment.author.thumbnail_image} size={50} />
                                <img className="comments_social_icon" src={social_icon} width={25} height={25}/>
                                <span className="comments_nickname">{comment.author.nickname}</span>
                                <TimeAgo className="comments_timeago" date={comment.reg_date} formatter={formatter}/>
                                <IconButton className="comments_menu" name="grade"/>
                            </div>
                            <div className="comments_body">
                                <Avatar className="comments_thumbnail ref" src={ref_comments.author.thumbnail_image} size={22} />
                                <img className="comments_social_icon ref" src={ref_comments_social_icon} width={22} height={22}/>
                                <span className="comments_nickname ref">{ref_comments.author.nickname}님에게</span>
                                <p className="comments_comments ref">{comment.comments}</p>
                            </div>
                        </Card>
                    )
                }

            });
        };

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleDialogClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onTouchTap={this.handleSubmit}
            />,
        ];

        return (
            <div>
                {mapToComponents(this.props.data)}
                <FABButton raised accent ripple className="comments_add_btn" onTouchTap={this.handleClickAddButton}>
                    <Icon name="comments" />
                </FABButton>
                <Dialog
                    title="댓글 달기"
                    actions={actions}
                    modal={true}
                    open={this.state.dialog.open}
                    onRequestClose={this.handleDialogClose} >
                    <TextField
                        hintText="Message Field"
                        floatingLabelText="MultiLine and FloatingLabel"
                        multiLine={true}
                        rows={2}
                        value={this.state.comments || ' '}
                        onChange={e=> { this.setState({ comments: e.target.value }); console.log(e.target.value) }}
                    /><br />
                </Dialog>
            </div>
        );
    }
}

Comments.propTypes = propTypes;

Comments.defaultProps = defaultProps;

export default Comments;