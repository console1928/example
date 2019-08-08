import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
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
            postLikesCount: (this.props.post.likes && this.props.post.likes.length) || 0,
            unauthenticatedMessageOpened: false
        };

        this.handleLikePress = this.handleLikePress.bind(this);
        this.showUnauthenticatedMessage = this.showUnauthenticatedMessage.bind(this);
        this.closeUnauthenticatedMessage = this.closeUnauthenticatedMessage.bind(this);
        this.togglePostLike = this.togglePostLike.bind(this);
    }

    Api = new Api();

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
        const day: number = date.getDate();
        const monthIndex: number = date.getMonth();
        const year: number = date.getFullYear();

        return `${monthNames[monthIndex]} ${day}, ${year}`;
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

    render(): JSX.Element | null {
        return (
            <div className={styles.container}>
                <div className={styles.hat}>
                    <div className={styles.author}>{this.props.post.author}</div>
                    <div className={styles.date}>
                        {this.props.post.date && this.formatDate(this.props.post.date)}
                    </div>
                </div>
                <div className={styles.name}>{this.props.post.name}</div>
                <div className={styles.text}>{this.props.post.text}</div>
                <div className={styles.footer}>
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
}

export default Post;
