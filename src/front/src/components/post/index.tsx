import React from "react";
import ReactMarkdown from "react-markdown";
import { FaHeart, FaRegHeart, FaRegTimesCircle, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import styles from "./post.module.css";
import { IPost, IUserInfo, IUserPublicInfo } from "../../types";
import Helpers from "../../helpers";
import Api from "../../api";
import PostComments from "../postComments";
import UnauthenticatedMessage from "../unauthenticatedMessage";
import Toast from "../toast";

interface IPostProps {
    userInfo: IUserInfo | null;
    post: IPost;
    usersPublicInfo: { [userId: string]: IUserPublicInfo };
    updateUsersPublicInfo: (userId: string) => void;
}

interface IPostState {
    postIsLiked: boolean;
    postIsExpanded: boolean;
    postLikesCount: number;
    unauthenticatedMessageIsOpened: boolean;
    postCommentValue: string;
    commentsAreLoading: boolean;
    commentsContainerHeight: number | null;
    errorMessageIsOpened: boolean;
}

class Post extends React.Component<IPostProps, IPostState> {
    constructor(props: IPostProps, state: IPostState) {
        super(props, state);

        this.state = {
            postIsLiked: (
                this.props.userInfo &&
                this.props.post &&
                this.props.post.likes &&
                this.props.post.likes.indexOf(this.props.userInfo._id) !== -1
            ) || false,
            postIsExpanded: false,
            postLikesCount: (this.props.post && this.props.post.likes && this.props.post.likes.length) || 0,
            unauthenticatedMessageIsOpened: false,
            postCommentValue: "",
            commentsAreLoading: false,
            commentsContainerHeight: null,
            errorMessageIsOpened: false
        };

        this.postContainerRef = null;
        this.postCommentsContainerRef = null;
        this.postCommentsRef = null;

        this.updateUsersPublicInfo = this.updateUsersPublicInfo.bind(this);
        this.handleClickOutsidePostContainer = this.handleClickOutsidePostContainer.bind(this);
        this.handleLikePress = this.handleLikePress.bind(this);
        this.showUnauthenticatedMessage = this.showUnauthenticatedMessage.bind(this);
        this.closeUnauthenticatedMessage = this.closeUnauthenticatedMessage.bind(this);
        this.togglePostLike = this.togglePostLike.bind(this);
        this.expandPost = this.expandPost.bind(this);
        this.commentPost = this.commentPost.bind(this);
        this.collapsePost = this.collapsePost.bind(this);
        this.setPostCommentValue = this.setPostCommentValue.bind(this);
        this.sendComment = this.sendComment.bind(this);
        this.commentsLoadingStarted = this.commentsLoadingStarted.bind(this);
        this.commentsLoadingFinished = this.commentsLoadingFinished.bind(this);
        this.openErrorMessage = this.openErrorMessage.bind(this);
        this.closeErrorMessage = this.closeErrorMessage.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onInputKeyPress = this.onInputKeyPress.bind(this);
    }

    postContainerRef: any = null;
    postCommentsContainerRef: any = null;
    postCommentsRef: any = null;
    pendingCommentsNumber: number = 0;
    unauthenticatedMessageTimer: any = null;

    Api = new Api();
    Helpers = new Helpers();

    componentDidMount(): void {
        document.addEventListener("mousedown", this.handleClickOutsidePostContainer);
        if (this.props.post && this.props.post.author) {
            this.updateUsersPublicInfo(this.props.post.author);
        }
    }

    componentDidUpdate(prevProps: IPostProps, prevState: IPostState): void {
        if (prevProps !== this.props) {
            this.setState({
                postIsLiked: (
                    this.props.userInfo &&
                    this.props.post &&
                    this.props.post.likes &&
                    this.props.post.likes.indexOf(this.props.userInfo._id) !== -1
                ) || false
            });
        }
    }

    componentWillUnmount(): void {
        document.removeEventListener("mousedown", this.handleClickOutsidePostContainer);
    }

    handleClickOutsidePostContainer(event: UIEvent): void {
        if (this.postContainerRef && !this.postContainerRef.contains(event.target)) {
            this.collapsePost();
        }
    }

    updateUsersPublicInfo(userId: string): void {
        if (!this.props.usersPublicInfo.hasOwnProperty(userId)) {
            this.props.updateUsersPublicInfo(userId);
        }
    }

    handleLikePress(): void {
        if (this.props.userInfo) {
            this.togglePostLike();
        } else {
            this.showUnauthenticatedMessage();
            this.unauthenticatedMessageTimer = setTimeout(this.closeUnauthenticatedMessage, 3000);
        }
    }

    showUnauthenticatedMessage(): void {
        this.setState({ unauthenticatedMessageIsOpened: true });
    }

    closeUnauthenticatedMessage(): void {
        this.setState({ unauthenticatedMessageIsOpened: false });
        clearTimeout(this.unauthenticatedMessageTimer);
    }

    togglePostLike(): void {
        this.Api.togglePostLike(this.props.post._id)
            .then(response => this.setState(
                    () => ({ postIsLiked: !this.state.postIsLiked }),
                    () => this.setState(
                            { postLikesCount: this.state.postLikesCount + (this.state.postIsLiked ? 1 : -1) }
                        )
                ))
            .catch(error => {
                    console.error(error);
                    this.openErrorMessage();
                });
    }

    commentPost(commentText: string): void {
        this.Api
            .createComment("post", this.props.post._id, commentText)
            .then(response => this.postCommentsRef.reloadPostComments())
            .catch(error => console.error(error));
    }

    expandPost(): void {
        this.setState({ postIsExpanded: true });
        this.pendingCommentsNumber = 0;
    }

    collapsePost(): void {
        this.setState({ postIsExpanded: false });
        this.pendingCommentsNumber = 0;
    }

    setPostCommentValue(event: React.FormEvent<HTMLDivElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.setState({ postCommentValue: target.value });
    }

    sendComment(): void {
        if (this.state.postCommentValue !== "") {
            this.commentPost(this.state.postCommentValue);
            this.setState({ postCommentValue: "" });
        }
    }

    onInputKeyPress(event: React.KeyboardEvent): void {
        if (event.charCode === 13 && this.state.postCommentValue !== "") {
            this.sendComment();
        }
    }

    commentsLoadingStarted(): void {
        this.pendingCommentsNumber += 1;
        if (this.pendingCommentsNumber > 0) {
            this.setState({ commentsAreLoading: true });
            if (this.postCommentsContainerRef) {
                this.setState({ commentsContainerHeight: this.postCommentsContainerRef.clientHeight });
            }
        }
    }

    commentsLoadingFinished(): void {
        this.pendingCommentsNumber -= 1;
        if (this.pendingCommentsNumber === 0) {
            this.setState({ commentsAreLoading: false, commentsContainerHeight: null });
        }
    }

    openErrorMessage(): void {
        this.setState({ errorMessageIsOpened: true });
    }

    closeErrorMessage(): void {
        this.setState({ errorMessageIsOpened: false });
    }

    onScroll(event: React.UIEvent<HTMLDivElement>): void {
        event.stopPropagation();
    }

    renderPost(): JSX.Element {
        const { userInfo, post, usersPublicInfo } = this.props;
        return (
            <div
                className={styles.container}
                ref={ref => this.postContainerRef = ref}
            >
                <div className={styles.hat}>
                    <div className={styles.userIcon}><FaUserCircle /></div>
                    <div className={styles.author}>
                        {usersPublicInfo && post.author && usersPublicInfo[post.author] && (
                            `${usersPublicInfo[post.author].firstName} ${usersPublicInfo[post.author].lastName}`)}
                    </div>
                    <div className={styles.date}>
                        {post.date && this.Helpers.formatDate(post.date)}
                    </div>
                    {this.state.postIsExpanded && (
                        <div className={styles.collapsePostButton} onClick={this.collapsePost}>
                            <FaRegTimesCircle />
                        </div>)}
                </div>
                <div className={styles.name}>{post.name}</div>
                <div className={this.state.postIsExpanded ? styles.textExpanded : styles.text}>
                    <ReactMarkdown source={post.text} />
                </div>
                {!this.state.postIsExpanded && (<div className={styles.textShadow} />)}
                <div className={styles.footer}>
                    {!this.state.postIsExpanded ? (
                            <div className={styles.expandPostButton} onClick={this.expandPost}>{"Read"}</div>
                        ) : (
                            post.comments && (
                                        <div className={styles.commentsTitle}>{"Comments"}</div>
                                    )
                        )}
                    <div className={this.state.postIsLiked ? styles.likeContainerActive : styles.likeContainer}>
                        <div
                            className={userInfo ? styles.likeButtonActive : styles.likeButtonDisabled}
                            onClick={this.handleLikePress}
                        >
                            {this.state.postIsLiked ? <FaHeart /> : <FaRegHeart />}
                        </div>
                        <div className={styles.likeCount}>{this.state.postLikesCount}</div>
                        {this.state.unauthenticatedMessageIsOpened && (
                                <UnauthenticatedMessage
                                    closeUnauthenticatedMessage={this.closeUnauthenticatedMessage}
                                />
                            )}
                    </div>
                </div>
                {this.state.postIsExpanded && post && post.comments && (
                        <div
                            ref={ref => this.postCommentsContainerRef = ref}
                            style={{ height: this.state.commentsContainerHeight || "initial" }}
                        >
                            <PostComments
                                ref={ref => this.postCommentsRef = ref}
                                userInfo={userInfo}
                                parent={post}
                                parentType={"post"}
                                commentsLoadingStarted={this.commentsLoadingStarted}
                                commentsLoadingFinished={this.commentsLoadingFinished}
                                usersPublicInfo={usersPublicInfo}
                                updateUsersPublicInfo={this.updateUsersPublicInfo}
                            />
                        </div>)}
                {this.state.postIsExpanded && (
                        <div className={styles.inputFieldContainer}>
                            {userInfo ? (
                                <React.Fragment>
                                    <div className={styles.inputUserIcon}><FaUserCircle /></div>
                                    <input
                                        className={styles.inputField}
                                        type={"text"}
                                        required={true}
                                        onChange={this.setPostCommentValue}
                                        onKeyPress={this.onInputKeyPress}
                                        value={this.state.postCommentValue}
                                        placeholder={"Leave a comment"}
                                    />
                                    <div className={styles.inputFieldButton} onClick={this.sendComment}>
                                        <FaPaperPlane className={styles.inputButtonIcon} />
                                        {"send"}
                                    </div>
                                </React.Fragment>
                            ) : (
                                "Log in or sign up to leave a comment"
                            )}
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

    renderPostExpanded(): JSX.Element {
        return (
            <div className={styles.modalContainer} onScroll={this.onScroll}>
                {this.renderPost()}
            </div>
        );
    }

    render(): JSX.Element | null {
        return this.state.postIsExpanded ? this.renderPostExpanded() : this.renderPost();
    }
}

export default Post;
