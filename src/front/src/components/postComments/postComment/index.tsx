import React from "react";
import { FaHeart, FaRegHeart, FaUserCircle, FaPen, FaPaperPlane } from "react-icons/fa";
import styles from "./postComment.module.css";
import { IUserInfo, IPostComment } from "../../../types";
import Helpers from "../../../helpers";
import Api from "../../../api";
import UnauthenticatedMessage from "../../unauthenticatedMessage";
import Toast from "../../toast";

interface IPostCommentProps {
    userInfo: IUserInfo | null;
    comment: IPostComment;
    reloadPostComments: () => void;
}

interface IPostCommentState {
    commentIsLiked: boolean;
    commentLikesCount: number;
    unauthenticatedMessageIsOpened: boolean;
    answerInputIsOpened: boolean;
    answerValue: string;
    errorMessageIsOpened: boolean;
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
            commentLikesCount: (
                this.props.comment && this.props.comment.likes && this.props.comment.likes.length
            ) || 0,
            unauthenticatedMessageIsOpened: false,
            answerInputIsOpened: false,
            answerValue: "",
            errorMessageIsOpened: false

        };

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
    }

    Api = new Api();
    Helpers = new Helpers();

    handleLikePress(): void {
        if (this.props.userInfo) {
            this.toggleCommentLike();
        } else {
            this.showUnauthenticatedMessage();
        }
    }

    toggleCommentLike(): void {
        this.Api.toggleCommentLike(this.props.comment._id)
            .then(response => this.setState(
                    () => ({ commentIsLiked: !this.state.commentIsLiked }),
                    () => this.setState(
                            { commentLikesCount: this.state.commentLikesCount + (this.state.commentIsLiked ? 1 : -1) }
                        )
                ))
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

    renderPostComment(comment: IPostComment): JSX.Element {
        return (
            <div className={styles.container}>
                <div className={styles.userIcon}><FaUserCircle /></div>
                <div className={styles.author}>{comment.author}</div>
                <div className={styles.date}>
                    {comment.date && this.Helpers.formatDate(comment.date)}
                </div>
                {this.props.userInfo ? (
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
                <div className={styles.likeContainer}>
                    <div
                        className={this.props.userInfo ? styles.likeButtonActive : styles.likeButtonDisabled}
                        onClick={this.handleLikePress}
                    >
                        {this.state.commentIsLiked ? <FaHeart /> : <FaRegHeart />}
                    </div>
                    <div className={styles.likeCount}>{this.state.commentLikesCount}</div>
                    {this.state.unauthenticatedMessageIsOpened && (
                        <UnauthenticatedMessage
                            closeUnauthenticatedMessage={this.closeUnauthenticatedMessage}
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
                            text={"Network or server error: failed to like."}
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
