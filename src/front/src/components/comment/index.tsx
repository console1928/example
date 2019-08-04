import React from "react";
import styles from "./comment.module.css";
import { IPostComment } from "../../types";

interface ICommentProps {
    comment: IPostComment;
}

interface ICommentState {}

class Comment extends React.Component<ICommentProps, ICommentState> {
    constructor(props: ICommentProps, state: ICommentState) {
        super(props, state);

        this.state = {};
    }

    renderComment(comment: IPostComment): JSX.Element {
        return (
            <div className={styles.commentContainer}>
                <div className={styles.commentAuthor}>{comment.author}</div>
                <div className={styles.commentText}>{comment.text}</div>
                <div className={styles.commentLike}>{comment.likes && comment.likes.length}</div>
                {comment.comments &&
                    comment.comments.length > 0 &&
                    comment.comments.map((comment: IPostComment) => this.renderComment(comment))}
            </div>
        );
    }

    render(): JSX.Element | null {
        return (
            this.renderComment(this.props.comment)
        );
    }
}

export default Comment;
