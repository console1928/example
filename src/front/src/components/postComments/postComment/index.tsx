import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaUserCircle, FaPen, FaPaperPlane } from "react-icons/fa";
import styles from "./postComment.module.css";
import { IUserInfo, IUserPublicInfo, IPostComment } from "../../../types";
import Helpers from "../../../helpers";
import Api from "../../../api";
import UnauthenticatedMessage from "../../unauthenticatedMessage";
import Toast from "../../toast";
import LikePopup from "../../likePopup";

interface IPostCommentProps {
    userInfo: IUserInfo | null;
    comment: IPostComment;
    reloadPostComments: () => void;
    usersPublicInfo: { [userId: string]: IUserPublicInfo };
    updateUsersPublicInfo: (userId: string) => void;
    toggleCommentLike: (commentId: string, userId: string) => void;
}

interface IPostCommentState {
    commentIsLiked: boolean;
    unauthenticatedMessageIsOpened: boolean;
    answerInputIsOpened: boolean;
    answerValue: string;
    errorMessageIsOpened: boolean;
    DefaultUserPictureIsShowing: boolean;
    likePopupIsOpened: boolean;
}

class PostComment extends React.Component<IPostCommentProps, IPostCommentState> {
    constructor(props: IPostCommentProps, state: IPostCommentState) {
        super(props, state);

        this.state = {
            commentIsLiked: (
                this.props.userInfo &&
                this.props.comment &&
                this.props.comment.likes &&
                this.props.comment.likes.indexOf(this.props.userInfo._id) !== -1
            ) || false,
            unauthenticatedMessageIsOpened: false,
            answerInputIsOpened: false,
            answerValue: "",
            errorMessageIsOpened: false,
            DefaultUserPictureIsShowing: false,
            likePopupIsOpened: false

        };

        this.updateUsersPublicInfo = this.updateUsersPublicInfo.bind(this);
        this.handleLikePress = this.handleLikePress.bind(this);
        this.toggleCommentLike = this.toggleCommentLike.bind(this);
        this.answerComment = this.answerComment.bind(this);
        this.showUnauthenticatedMessage = this.showUnauthenticatedMessage.bind(this);
        this.closeUnauthenticatedMessage = this.closeUnauthenticatedMessage.bind(this);
        this.renderPostComment = this.renderPostComment.bind(this);
        this.setAnswerValue = this.setAnswerValue.bind(this);
        this.openAnswerInput = this.openAnswerInput.bind(this);
        this.closeAnswerInput = this.closeAnswerInput.bind(this);
        this.sendAnswer = this.sendAnswer.bind(this);
        this.openErrorMessage = this.openErrorMessage.bind(this);
        this.closeErrorMessage = this.closeErrorMessage.bind(this);
        this.onInputKeyPress = this.onInputKeyPress.bind(this);
        this.showDefaultUserPicture = this.showDefaultUserPicture.bind(this);
        this.openLikePopup = this.openLikePopup.bind(this);
        this.closeLikePopup = this.closeLikePopup.bind(this);
    }

    unauthenticatedMessageTimer: any = null;

    Api = new Api();
    Helpers = new Helpers();

    componentDidMount(): void {
        if (this.props.comment && this.props.comment.author) {
            this.updateUsersPublicInfo(this.props.comment.author);
        }
    }

    componentDidUpdate(prevProps: IPostCommentProps, prevState: IPostCommentState): void {
        if (prevProps !== this.props) {
            const { userInfo, comment } = this.props;
            this.setState({
                commentIsLiked: (
                    userInfo && comment && comment.likes && comment.likes.indexOf(userInfo._id) !== -1
                ) || false
            });
        }
    }

    updateUsersPublicInfo(userId: string): void {
        if (!this.props.usersPublicInfo.hasOwnProperty(userId)) {
            this.props.updateUsersPublicInfo(userId);
        }
    }

    handleLikePress(): void {
        this.setState({ likePopupIsOpened: false });
        if (this.props.userInfo) {
            this.toggleCommentLike();
        } else {
            this.showUnauthenticatedMessage();
            this.unauthenticatedMessageTimer = setTimeout(this.closeUnauthenticatedMessage, 3000);
        }
    }

    toggleCommentLike(): void {
        const { comment, userInfo, toggleCommentLike } = this.props;
        this.Api.toggleCommentLike(comment._id)
            .then(response => {
                    if (userInfo && userInfo._id) {
                        toggleCommentLike(comment._id, userInfo._id);
                    }
                })
            .catch(error => {
                    console.error(error);
                    this.openErrorMessage();
                });
    }

    answerComment(commentText: string): void {
        this.Api
            .createComment("comment", this.props.comment._id, commentText)
            .then(response => this.props.reloadPostComments())
            .catch(error => console.error(error));
    }

    showUnauthenticatedMessage(): void {
        this.setState({ unauthenticatedMessageIsOpened: true });
    }

    closeUnauthenticatedMessage(): void {
        this.setState({ unauthenticatedMessageIsOpened: false });
        clearTimeout(this.unauthenticatedMessageTimer);
    }

    setAnswerValue(event: React.FormEvent<HTMLDivElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.setState({ answerValue: target.value });
    }

    onInputKeyPress(event: React.KeyboardEvent): void {
        if (event.charCode === 13 && this.state.answerValue !== "") {
            this.sendAnswer();
        }
    }

    openAnswerInput(): void {
        this.setState({ answerInputIsOpened: true });
    }

    closeAnswerInput(): void {
        this.setState({ answerInputIsOpened: false });
    }

    sendAnswer(): void {
        if (this.state.answerValue !== "") {
            this.closeAnswerInput();
            this.answerComment(this.state.answerValue);
            this.setState({ answerValue: "" });
        }
    }

    openErrorMessage(): void {
        this.setState({ errorMessageIsOpened: true });
    }

    closeErrorMessage(): void {
        this.setState({ errorMessageIsOpened: false });
    }

    showDefaultUserPicture(): void {
        this.setState({ DefaultUserPictureIsShowing: true });
    }

    openLikePopup(): void {
        if (!this.state.unauthenticatedMessageIsOpened) {
            this.setState({ likePopupIsOpened: true });
        }
    }

    closeLikePopup(): void {
        this.setState({ likePopupIsOpened: false });
    }

    renderPostComment(comment: IPostComment): JSX.Element {
        const { userInfo, usersPublicInfo } = this.props;
        return (
            <div className={styles.container}>
                <div className={styles.userIcon}>
                    <Link className={styles.userLink} to={`/user/${comment.author}`}>
                        <div className={styles.userIcon}>
                            {this.state.DefaultUserPictureIsShowing ? (
                                    <FaUserCircle className={styles.defaultUserPicture} />
                                ) : (
                                    <img
                                        className={styles.userPicture}
                                        src={
                                            usersPublicInfo &&
                                                comment.author &&
                                                usersPublicInfo[comment.author] &&
                                                usersPublicInfo[comment.author].picture
                                        }
                                        onError={this.showDefaultUserPicture}
                                    />
                                )}
                        </div>
                        <div className={styles.author}>
                            {usersPublicInfo && comment.author && usersPublicInfo[comment.author] && (
                                `${
                                    usersPublicInfo[comment.author].firstName
                                } ${
                                    usersPublicInfo[comment.author].lastName
                                }`)}
                        </div>
                    </Link>
                </div>
                <div className={styles.date}>
                    {comment.date && this.Helpers.formatDate(comment.date)}
                </div>
                {userInfo ? (
                    <div
                        className={styles.answerButton}
                        onClick={this.openAnswerInput}
                    >
                        <FaPen className={styles.answerIcon} />
                        {"answer"}
                    </div>
                ) : (
                    <div className={styles.unauthenticatedAnswerButton}>
                        {"log in or sign up to answer"}
                    </div>
                )}
                <div
                    className={styles.likeContainer}
                    onMouseEnter={this.openLikePopup}
                    onMouseLeave={this.closeLikePopup}
                >
                    <div
                        className={userInfo ? styles.likeButtonActive : styles.likeButtonDisabled}
                        onClick={this.handleLikePress}
                    >
                        {this.state.commentIsLiked ? <FaHeart /> : <FaRegHeart />}
                    </div>
                    {this.props.comment.likes && (
                        <div className={styles.likeCount}>
                            {this.props.comment.likes.length}
                        </div>)}
                    {this.state.unauthenticatedMessageIsOpened && (
                        <UnauthenticatedMessage
                            closeUnauthenticatedMessage={this.closeUnauthenticatedMessage}
                        />)}
                    {this.props.comment.likes &&
                        this.state.likePopupIsOpened && (
                            <LikePopup
                                userInfo={userInfo}
                                likes={comment.likes}
                                isLiked={this.state.commentIsLiked}
                                likesCount={this.props.comment.likes.length}
                                usersPublicInfo={usersPublicInfo}
                                updateUsersPublicInfo={this.updateUsersPublicInfo}
                            />)}
                </div>
                <div className={styles.text}>{comment.text}</div>
                {this.state.answerInputIsOpened && (
                        <div className={styles.inputFieldContainer}>
                            <input
                                className={styles.inputField}
                                type={"text"}
                                required={true}
                                onChange={this.setAnswerValue}
                                onKeyPress={this.onInputKeyPress}
                                value={this.state.answerValue}
                            />
                            <div className={styles.inputFieldButton} onClick={this.sendAnswer}>
                                <FaPaperPlane className={styles.inputButtonIcon} />
                                {"send"}
                            </div>
                        </div>
                    )}
                {this.state.errorMessageIsOpened && (
                        <Toast
                            text={"Network or server error: failed to toggle like."}
                            closeToast={this.closeErrorMessage}
                        />
                    )}
            </div>
        );
    }

    render(): JSX.Element | null {
        return (
            this.renderPostComment(this.props.comment)
        );
    }
}

export default PostComment;
