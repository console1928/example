import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import styles from "./post.module.css";
import { IPost } from "../../types";
import Api from "../../api";
import Comment from "../comment";

interface IPostProps {
    post: IPost;
}

interface IPostState {
    postIsLiked: boolean;
}

class Post extends React.Component<IPostProps, IPostState> {
    constructor(props: IPostProps, state: IPostState) {
        super(props, state);

        this.state = {
            postIsLiked: false
        };

        this.togglePostLike = this.togglePostLike.bind(this);
    }
    
    Api = new Api();

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

    togglePostLike(): void {
        this.setState({ postIsLiked: !this.state.postIsLiked });
        this.Api.togglePostLike();
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
                            className={styles.likeButton}
                            onClick={this.togglePostLike}
                        >
                            {this.state.postIsLiked ? <FaHeart /> : <FaRegHeart />}
                        </div>
                        <div className={styles.likeCount}>
                            {this.props.post.likes && (
                                this.props.post.likes.length + (this.state.postIsLiked ? 1 : 0)
                                )}
                        </div>
                    </div>
                </div>
                <div>
                    {this.props.post.comments &&
                        this.props.post.comments.map(
                            (comment: any) => (
                                <Comment comment={comment} />
                            ))}
                </div>
            </div>
        );
    }
}

export default Post;
