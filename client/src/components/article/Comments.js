import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Card, CardActions, IconButton, Button, Tooltip, Snackbar } from 'react-mdl';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import CommentArrowIcon from 'material-ui/svg-icons/navigation/subdirectory-arrow-right';
import TimeAgo from 'react-timeago';
import koreanStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import update from 'react-addons-update';
const formatter = buildFormatter(koreanStrings);
const propTypes = {};

const defaultProps = {};

class Comments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: '',
            hidden: false,
            redirected: this.props.redirected,
            openDialog: false,
            dialogMode: '',
            DialogButtonText: '',
            dialogCommentsId: '',
            dialogTitle: '',
            dialogComments: '',
            dialogHidden: false,
            params: this.props.location.query,
            isSnackbarActive: false,
        };
        this.handleShowSnackbar = this.handleShowSnackbar.bind(this);
        this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.handleDialogTextFieldChange = this.handleDialogTextFieldChange.bind(this);
        this.handleTextFieldFocus = this.handleTextFieldFocus.bind(this);
        this.handleOpenRegisterDialog = this.handleOpenRegisterDialog.bind(this);
        this.handleOpenModifyDialog = this.handleOpenModifyDialog.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitDialog = this.handleSubmitDialog.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
		this.handleClickRemove = this.handleClickRemove.bind(this);
        this.handleDialogCheck = this.handleDialogCheck.bind(this);
        this.redirectLoginPage = this.redirectLoginPage.bind(this);
    }

    handleShowSnackbar(message) {
        this.setState({
            snackbarMessage: message,
            isSnackbarActive: true
        });
    }

    handleTimeoutSnackbar() {
        this.setState({
            snackbarMessage: '',
            isSnackbarActive: false
        });
    }

    handleTextFieldChange(e) {
        this.setState(update(this.state, {
            comments: { $set: e.target.value }
        }))
    }

    handleDialogTextFieldChange(e) {
        this.setState(update(this.state, {
            dialogComments: { $set: e.target.value }
        }))
    }

    handleTextFieldFocus(e) {
        const user = this.props.user;
        if (!user) {
            if (confirm('댓글을 남기려면 먼저 로그인 해야합니다. 로그인 화면으로 이동하시겠습니까?')) {
                this.redirectLoginPage('c');
            } else {
                e.target.blur();
            }
        }
    }

    handleOpenRegisterDialog(e) {
        const node = e.target.dataset.refComment ? e.target : e.target.parentNode;
        const user = this.props.user;
        const ref_comment = node.dataset.refComment;
        const ref_comment_comment = node.dataset.refCommentComment;
        if (!user) {
            if (confirm('댓글을 남기려면 먼저 로그인 해야합니다. 로그인 화면으로 이동하시겠습니까?')) {
                this.redirectLoginPage('cc', ref_comment_comment);
            } else {
                return;
            }
        }
        const currentComments = this.props.data.find(comments => comments._id === ref_comment_comment);
        const social_icon = `/image/${currentComments.author.login_type}_icon.png`;
        this.setState({
            dialogTitle: (
                <div>
                    <Avatar className="comments_thumbnail" src={currentComments.author.thumbnail_image ? currentComments.author.thumbnail_image : '/image/default_icon.png'} size={50} />
                    <img className="comments_social_icon" src={social_icon} width={30} height={30}/>
                    <span className="comments_nickname">{currentComments.author.nickname}님에게</span>
                </div>
            ),
            openDialog: true,
            dialogMode: 'register',
            dialogHidden: false,
            dialogComments: '',
            dialogButtonText: '댓글 등록',
            ref_comment,
            ref_comment_comment
        });
    }

    handleOpenModifyDialog(e) {
        const node = e.target.dataset.id ? e.target : e.target.parentNode;
        const comments = this.props.data.find((list) => { return list._id === node.dataset.id });
        this.setState({
            dialogTitle: '댓글 수정하기',
            openDialog: true,
            dialogMode: 'modify',
            dialogButtonText: '댓글 수정',
            dialogCommentsId: comments._id,
            dialogHidden: comments.hidden,
            dialogComments: comments.comments
        });
    }

    handleSubmitDialog() {
        const user = this.props.user;
        // const comments = this.state.dialogComments.replace(/(?:\r\n|\r|\n)/g, '<br />');
        const comments = this.state.dialogComments;

        if (this.state.dialogMode === 'register') {
            this.props.registerRequest(user.token, {
                author: {
                    _id: user._id,
                    nickname: user.nickname,
                    thumbnail_image: user.thumbnail_image,
                    login_type: user.type || 'ahribori',
                },
                ref_comment: this.state.ref_comment,
                ref_comment_comment: this.state.ref_comment_comment,
                ref_article: this.props.refArticle,
                hidden: this.state.hidden,
                comments
            }).then(() => {
                this.props.getArticleRequest(this.props.refArticle, user.token);
                this.handleShowSnackbar('댓글이 등록되었습니다');
                this.setState(update(this.state, {
                    openDialog: { $set: false },
                    dialogComments: { $set: '' }
                }))
            })
        } else {
            this.props.modifyRequest(user.token, {
                _id: this.state.dialogCommentsId,
                comments: this.state.dialogComments,
                hidden: this.state.dialogHidden
            }).then(() => {
                this.props.getArticleRequest(this.props.refArticle, user.token);
                this.handleShowSnackbar('댓글이 수정되었습니다');
                this.setState(update(this.state, {
                    openDialog: { $set: false },
                    dialogComments: { $set: '' }
                }));
            })
        }
    }

    handleCloseDialog() {
        this.setState({
            openDialog: false
        });
    }

    handleCheck() {
        this.setState({
            hidden: !this.state.hidden
        });
    }

    handleDialogCheck() {
        this.setState({
            dialogHidden: !this.state.dialogHidden
        });
    }

    handleSubmit() {
        const user = this.props.user;
        if (!user) {
            if (confirm('댓글을 남기려면 먼저 로그인 해야합니다. 로그인 화면으로 이동하시겠습니까?')) {
                this.redirectLoginPage('c');
            }
        } else {
            const ref_article = this.props.refArticle;
            // const comments = this.state.comments.replace(/(?:\r\n|\r|\n)/g, '<br />');
            const comments = this.state.comments;
            this.props.registerRequest(user.token, {
                author: {
                    _id: user._id,
                    nickname: user.nickname,
                    thumbnail_image: user.thumbnail_image,
                    login_type: user.type || 'ahribori',
                },
                hidden: this.state.hidden,
                ref_article,
                comments
            }).then(() => {
                this.props.getArticleRequest(this.props.refArticle, user.token)
                    .then(()=> {
                        if (!this.props.comments.register.error) {
                            const location = window.location || {};
                            location.hash = '#comments_form';
                        } else {
                            switch (this.props.comments.register.error.status) {
                                case 400:
                                    alert('댓글을 작성하신 뒤에 댓글 달기 버튼을 클릭하세요');
                                    break;
                                case 444:
                                    alert('짧은 시간 동안 여러 번 요청할 수 없습니다');
                                    break;
                            }
                        }
                    });
                this.handleShowSnackbar('댓글이 등록되었습니다');
                this.setState(update(this.state, {
                    comments: { $set: '' }
                }))
            })
        }
    }

	handleClickRemove(e) {
		const node = e.target.dataset.id ? e.target : e.target.parentNode;
		if (confirm('댓글을 정말 삭제하시겠습니까? 댓글의 댓글이 있을 경우 모두 삭제됩니다.')) {
			this.props.removeRequest(this.props.user.token, node.dataset.id)
				.then(() => {
					this.props.getArticleRequest(this.props.refArticle);
				});
		}
	}

    redirectLoginPage(mode, ref_comment) {
        let redirectURL = '';
        if (mode === 'c') {
            redirectURL = encodeURIComponent(`/article/${this.props.refArticle}?redirected=c`);
        } else if (mode === 'cc') {
            redirectURL = encodeURIComponent(`/article/${this.props.refArticle}?redirected=cc&rc=${ref_comment}`);
        }

        browserHistory.push('/login?callback=' + redirectURL);
    }

    componentDidMount() {
        if (this.state.redirected === 'c') {
            $('.comments_textarea textarea').focus();
        } else if (this.state.redirected === 'cc') {
            setTimeout(() => {
                location.hash = `#comments_${this.state.params.rc}`;
            }, 300);
            $(`button[data-ref-comment-comment=${this.state.params.rc}]`).click();
            // TODO 댓글의 댓글 -> 로그인 -> ?
        }
    }

    render() {
        const mapToComponents = (list) => {
            return list.map((comment, index, comments) => {
                const social_icon = `/image/${comment.author.login_type}_icon.png`;
                const hasRef = comment._id !== comment.ref_comment;

				const commentsMenu = (
					<span className="comments_btn_group">
						<Tooltip label="수정">
							<IconButton
								className="comments_modify_btn"
								data-id={comment._id}
								onClick={this.handleOpenModifyDialog}
								name="edit"/>
						</Tooltip>
						<Tooltip label="삭제">
							<IconButton
								className="comments_remove_btn"
								data-id={comment._id}
								onClick={this.handleClickRemove}
								name="clear"/>
						</Tooltip>
					</span>
				);

				const profile = (
					<div>
						<Avatar className="comments_thumbnail" src={comment.author.thumbnail_image ? comment.author.thumbnail_image : '/image/default_icon.png'} size={50} />
						<img className="comments_social_icon" src={social_icon} width={25} height={25}/>
						<span className="comments_nickname">{comment.author.nickname}</span>
						<TimeAgo className="comments_timeago" date={comment.reg_date} formatter={formatter}/>
						{this.props.user && ((this.props.user._id === comment.author._id) || this.props.user.admin) ? commentsMenu : ''}
					</div>
				);


                if (!hasRef) { // 일반
                    return (
                        <Card id={`comments_${comment._id}`} key={index} shadow={0} className="comments_container">
                            <div className="comments_header">
								{profile}
                                <Tooltip label="댓글달기">
                                    <IconButton
                                        data-ref-comment={comment._id}
                                        data-ref-comment-comment={comment._id}
                                        className="comments_comments_btn"
                                        name="subdirectory_arrow_right"
                                        onClick={this.handleOpenRegisterDialog}
                                    />
                                </Tooltip>
                                <Tooltip label="추천하기">
                                    <IconButton
                                        className="comments_star_btn"
                                        name="grade"/>
                                </Tooltip>
                            </div>
                            <div className="comments_body">
                                <div className="comments_comments">{comment.comments}</div>
                            </div>
                        </Card>
                    )
                } else { // 덧글의 덧글
                    const ref_comments = !comment.ref_comment_comment ?
                        comments.find(comments => comments._id === comment.ref_comment) :
                        comments.find(comments => comments._id === comment.ref_comment_comment);

                    const ref_comments_social_icon = `/image/${ref_comments.author.login_type}_icon.png`;
                    return (
                        <Card id={`comments_${comment._id}`} key={index} shadow={0} className="comments_container child">
                            <CommentArrowIcon className="comments_child_icon"/>
                            <div className="comments_header">
								{profile}
                                <Tooltip label="댓글달기">
                                    <IconButton
                                        data-ref-comment={comment.ref_comment}
                                        data-ref-comment-comment={comment._id}
                                        className="comments_comments_btn"
                                        name="subdirectory_arrow_right"
                                        onClick={this.handleOpenRegisterDialog}
                                    />
                                </Tooltip>
                                <Tooltip label="추천하기">
                                    <IconButton
                                        className="comments_star_btn"
                                        name="grade"/>
                                </Tooltip>
                            </div>
                            <div className="comments_body">
                                <Avatar className="comments_thumbnail ref" src={ref_comments.author.thumbnail_image ? ref_comments.author.thumbnail_image : '/image/default_icon.png'} size={22} />
                                <img className="comments_social_icon ref" src={ref_comments_social_icon} width={22} height={22}/>
                                <span className="comments_nickname ref">{ref_comments.author.nickname}님에게</span>
                                <div className="comments_comments ref">{comment.comments}</div>
                            </div>
                        </Card>
                    )
                }

            });
        };

        const actions = [
            <RaisedButton
                label="닫기"
                style={{ marginRight: '10px'}}
                onTouchTap={this.handleCloseDialog}
            />,
            <RaisedButton
                label={this.state.dialogButtonText || '댓글 등록'}
                primary={true}
                onTouchTap={this.handleSubmitDialog}
            />,
        ];

        return (
            <div>
                <Card shadow={0} id="comments_form" className="comments_container form">
                    <div className="form_wrapper">
                        <TextField
                            className="comments_textarea"
                            onChange={this.handleTextFieldChange}
                            onFocus={this.handleTextFieldFocus}
                            value={this.state.comments}
                            fullWidth={true}
                            hintText=""
                            floatingLabelText="댓글을 남겨주세요!"
                            multiLine={true}
                            rows={1}
                        />
                        <Checkbox
                            className="comments_hidden_checkbox"
                            checked={!this.state.hidden}
                            checkedIcon={<Visibility />}
                            uncheckedIcon={<VisibilityOff />}
                            onCheck={this.handleCheck}
                            label={this.state.hidden ? '게시물 작성자와 나만 볼 수 있습니다' : '모두가 볼 수 있습니다'}
                        />
                    </div>
                    <CardActions className="comments_card_actions">
                        <Button raised colored ripple onClick={this.handleSubmit}>댓글 등록</Button>
                    </CardActions>
                </Card>
                {mapToComponents(this.props.data)}
                <Dialog
                    title={this.state.dialogTitle}
                    actions={actions}
                    modal={true}
                    open={this.state.openDialog}
                    onRequestClose={this.handleCloseDialog}
                    className="comments_dialog"
                >
                    <TextField
                        className="comments_textarea"
                        onChange={this.handleDialogTextFieldChange}
                        onFocus={this.handleTextFieldFocus}
                        value={this.state.dialogComments}
                        fullWidth={true}
                        hintText=""
                        floatingLabelText="댓글을 남겨주세요!"
                        multiLine={true}
                        rows={1}
                    />
                    <Checkbox
                        className="comments_hidden_checkbox"
                        checked={!this.state.dialogHidden}
                        checkedIcon={<Visibility />}
                        uncheckedIcon={<VisibilityOff />}
                        onCheck={this.handleDialogCheck}
                        label={this.state.dialogHidden ? '게시물 작성자와 나만 볼 수 있습니다' : '모두가 볼 수 있습니다'}
                    />
                </Dialog>
                <Snackbar
                    active={this.state.isSnackbarActive}
                    onTimeout={this.handleTimeoutSnackbar}
                >{this.state.snackbarMessage}</Snackbar>
            </div>
        );
    }
}

Comments.propTypes = propTypes;

Comments.defaultProps = defaultProps;

export default Comments;