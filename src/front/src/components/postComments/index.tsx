import React from "react";
import styles from "./postComments.module.css";
import { IUserInfo, IUserPublicInfo, IPost, IPostComment } from "../../types";
import Api from "../../api";
import PostComment from "./postComment";

type IPostCommentsParentType = "post" | "comment";

interface IPostCommentsProps {
    userInfo: IUserInfo | null;
    parentType: IPostCommentsParentType;
    parent: IPost | IPostComment;
    commentsLoadingStarted: () => void;
    commentsLoadingFinished: () => void;
    usersPublicInfo: { [userId: string]: IUserPublicInfo };
    updateUsersPublicInfo: (userId: string) => void;
}

interface IPostCommentsState {
    comments: IPostComment[] | null;
}

class PostComments extends React.Component<IPostCommentsProps, IPostCommentsState> {
    constructor(props: IPostCommentsProps, state: IPostCommentsState) {
        super(props, state);

        this.state = {
            comments: null
        };

        this.postCommentsContainerRef = null;

        this.updateUsersPublicInfo = this.updateUsersPublicInfo.bind(this);
        this.queryComments = this.queryComments.bind(this);
        this.renderPostComments = this.renderPostComments.bind(this);
        this.reloadPostComments = this.reloadPostComments.bind(this);
    }

    postCommentsContainerRef: any = null;
    delayCommentsHeightResetTimer: any = null;

    Api = new Api();

    componentDidMount(): void {
        if (this.props.parent.comments) {
            this.queryComments();
        }
    }

    updateUsersPublicInfo(userId: string): void {
        if (!this.props.usersPublicInfo.hasOwnProperty(userId)) {
            this.props.updateUsersPublicInfo(userId);
        }
    }

    queryComments: () => void = () => {
        this.setState({ comments: null });
        this.Api.queryComments(this.props.parentType, this.props.parent._id)
            .then(comments => this.setState({ comments }))
            .catch(error => console.error(error));
    }

    reloadPostComments: () => void = () => {
        this.props.commentsLoadingStarted();
        this.setState({ comments: null });
        this.Api.queryComments(this.props.parentType, this.props.parent._id)
            .then(comments => this.setState(
                    () => ({ comments }),
                    () => this.props.commentsLoadingFinished()
                ))
            .catch(error => console.error(error));
    }

    renderPostComments(): JSX.Element {
        return (
            <div className={styles.container} ref={ref => this.postCommentsContainerRef = ref}>
                {this.state.comments &&
                    this.state.comments.map((comment: IPostComment) => (
                            <React.Fragment key={comment._id}>
                                <PostComment
                                    userInfo={this.props.userInfo}
                                    comment={comment}
                                    reloadPostComments={this.reloadPostComments}
                                    usersPublicInfo={this.props.usersPublicInfo}
                                    updateUsersPublicInfo={this.updateUsersPublicInfo}
                                />
                                <div className={styles.childComments}>
                                    <PostComments
                                        userInfo={this.props.userInfo}
                                        parent={comment}
                                        parentType={"comment"}
                                        commentsLoadingStarted={this.props.commentsLoadingStarted}
                                        commentsLoadingFinished={this.props.commentsLoadingFinished}
                                        usersPublicInfo={this.props.usersPublicInfo}
                                        updateUsersPublicInfo={this.updateUsersPublicInfo}
                                    />
                                </div>
                            </React.Fragment>
                        )
                    )}
            </div>
        );
    }

    render(): JSX.Element | null {
        return this.renderPostComments();
    }
}

export default PostComments;
