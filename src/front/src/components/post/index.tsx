import React from "react";
import ReactMarkdown from "react-markdown";
import { FaHeart, FaRegHeart, FaRegTimesCircle } from "react-icons/fa";
import styles from "./post.module.css";
import { IPost, IUserInfo } from "../../types";
import Api from "../../api";
import Comment from "../comment";
import UnauthenticatedMessage from "../unauthenticatedMessage";

interface IPostProps {
    userInfo: IUserInfo | null;
    post: IPost;
}

interface IPostState {
    postIsLiked: boolean;
    postIsExpanded: boolean;
    postLikesCount: number;
    unauthenticatedMessageOpened: boolean;
}

class Post extends React.Component<IPostProps, IPostState> {
    constructor(props: IPostProps, state: IPostState) {
        super(props, state);

        this.state = {
            postIsLiked: (
                this.props.post.likes &&
                this.props.userInfo &&
                this.props.post.likes.indexOf(this.props.userInfo._id) !== -1
            ) || false,
            postIsExpanded: false,
            postLikesCount: (this.props.post.likes && this.props.post.likes.length) || 0,
            unauthenticatedMessageOpened: false
        };

        this.postContainerRef = null;

        this.handleClickOutsidePostContainer = this.handleClickOutsidePostContainer.bind(this);
        this.handleLikePress = this.handleLikePress.bind(this);
        this.showUnauthenticatedMessage = this.showUnauthenticatedMessage.bind(this);
        this.closeUnauthenticatedMessage = this.closeUnauthenticatedMessage.bind(this);
        this.togglePostLike = this.togglePostLike.bind(this);
        this.expandPost = this.expandPost.bind(this);
        this.collapsePost = this.collapsePost.bind(this);
    }

    postContainerRef: any = null;

    Api = new Api();

    componentDidMount(): void {
        document.addEventListener("mousedown", this.handleClickOutsidePostContainer);
    }

    componentWillUnmount(): void {
        document.removeEventListener("mousedown", this.handleClickOutsidePostContainer);
    }

    handleClickOutsidePostContainer(event: UIEvent): void {
        if (this.postContainerRef && !this.postContainerRef.contains(event.target)) {
            this.collapsePost();
          }
    }

    componentDidUpdate(nextProps: IPostProps, nextState: IPostState): void {
        if (nextProps !== this.props) {
            this.setState({
                postIsLiked: (
                    this.props.post.likes &&
                    this.props.userInfo &&
                    this.props.post.likes.indexOf(this.props.userInfo._id) !== -1
                ) || false
            });
        }
    }

    formatDate(dateString: string): string {
        const monthNames: string[] = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        const date: Date = new Date(dateString);
        let hours: number | string = date.getHours();
        if (hours < 10) { hours = "0" + hours; }
        let minutes: number | string = date.getMinutes();
        if (minutes < 10) { minutes = "0" + minutes; }
        const day: number = date.getDate();
        const month: number = date.getMonth();
        const year: number = date.getFullYear();

        return `${monthNames[month]} ${day}, ${year} at ${hours}:${minutes}`;
    }

    handleLikePress(): void {
        if (this.props.userInfo) {
            this.togglePostLike();
        } else {
            this.showUnauthenticatedMessage();
        }
    }

    showUnauthenticatedMessage(): void {
        this.setState({ unauthenticatedMessageOpened: true });
    }

    closeUnauthenticatedMessage(): void {
        this.setState({ unauthenticatedMessageOpened: false });
    }

    togglePostLike(): void {
        this.setState(
            () => ({ postIsLiked: !this.state.postIsLiked }),
            () => this.setState({ postLikesCount: this.state.postLikesCount + (this.state.postIsLiked ? 1 : -1) }));
        this.Api.togglePostLike(this.props.post._id);
    }

    expandPost(): void {
        this.setState({ postIsExpanded: true });
    }

    collapsePost(): void {
        this.setState({ postIsExpanded: false });
    }

    renderPost(): JSX.Element {
        return (
            <div
                className={styles.container}
                ref={ref => (this.postContainerRef = ref)}
            >
                <div className={styles.hat}>
                    <div className={styles.author}>{this.props.post.author}</div>
                    <div className={styles.date}>
                        {this.props.post.date && this.formatDate(this.props.post.date)}
                    </div>
                    {this.state.postIsExpanded && (
                        <div className={styles.collapsePostButton} onClick={this.collapsePost}>
                            <FaRegTimesCircle />
                        </div>)}
                </div>
                <div className={styles.name}>{this.props.post.name}</div>
                <div className={this.state.postIsExpanded ? styles.textExpanded : styles.text}>
                    <ReactMarkdown source={this.props.post.text} />
                </div>
                {!this.state.postIsExpanded && (<div className={styles.textShadow} />)}
                <div className={styles.footer}>
                    {!this.state.postIsExpanded && (
                        <div className={styles.expandPostButton} onClick={this.expandPost}>
                            {"Read"}
                        </div>)}
                    <div className={this.state.postIsLiked ? styles.likeContainerActive : styles.likeContainer}>
                        <div
                            className={this.props.userInfo ? styles.likeButtonActive : styles.likeButtonDisabled}
                            onClick={this.handleLikePress}
                        >
                            {this.state.postIsLiked ? <FaHeart /> : <FaRegHeart />}
                        </div>
                        <div className={styles.likeCount}>{this.state.postLikesCount}</div>
                        {this.state.unauthenticatedMessageOpened && (
                            <UnauthenticatedMessage closeUnauthenticatedMessage={this.closeUnauthenticatedMessage} />)}
                    </div>
                </div>
                <div>
                    {this.props.post.comments &&
                        this.props.post.comments.map(
                            (comment: any) => (
                                <Comment comment={comment} />
                            )
                        )}
                </div>
            </div>
        );
    }

    renderPostExpanded(): JSX.Element {
        return (
            <div className={styles.modalContainer}>
                {this.renderPost()}
            </div>
        );
    }

    render(): JSX.Element | null {
        return this.state.postIsExpanded ? this.renderPostExpanded() : this.renderPost();
    }
}

export default Post;
