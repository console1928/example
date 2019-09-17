import React from "react";
import { FaCopyright, FaPlus, FaPlusCircle, FaCommentAlt } from "react-icons/fa";
import styles from "./main.module.css";
import { IUserInfo, IUserPublicInfo, IPost } from "../../types";
import Api from "../../api";
import Post from "../post";
import TopBar from "../topBar";
import CreatePostModal from "../createPostModal";
import FeedbackModal from "../feedbackModal";
import Toast from "../toast";

interface IMainProps {
    userInfo: IUserInfo | null;
    setUserInfo: (userInfo: IUserInfo | null) => void;
    usersPublicInfo: { [userId: string]: IUserPublicInfo };
    updateUsersPublicInfo: (userId: string) => void;
}

interface IMainState {
    posts: IPost[];
    postsStartDate: string | null;
    postsStartNumber: number;
    allPostsViewed: boolean;
    scrolledToBottom: boolean;
    queryPostsPending: boolean;
    networkError: boolean;
    createPostModalIsOpened: boolean;
    serverErrorMessageIsOpened: boolean;
    postCreatedMessageIsOpened: boolean;
    feedbackModalIsOpened: boolean;
    feedbackIsSentMessageIsOpened: boolean;
    searchValue: string;
}

class Main extends React.Component<IMainProps, IMainState> {
    constructor(props: IMainProps, state: IMainState) {
        super(props, state);

        this.state = {
            posts: [],
            postsStartDate: null,
            postsStartNumber: 0,
            allPostsViewed: false,
            scrolledToBottom: false,
            queryPostsPending: false,
            networkError: false,
            createPostModalIsOpened: false,
            serverErrorMessageIsOpened: false,
            postCreatedMessageIsOpened: false,
            feedbackModalIsOpened: false,
            feedbackIsSentMessageIsOpened: false,
            searchValue: ""
        };

        this.setUserInfo = this.setUserInfo.bind(this);
        this.updateUsersPublicInfo = this.updateUsersPublicInfo.bind(this);
        this.queryPostsChunk = this.queryPostsChunk.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.openCreatePostModal = this.openCreatePostModal.bind(this);
        this.closeCreatePostModal = this.closeCreatePostModal.bind(this);
        this.openServerErrorMessage = this.openServerErrorMessage.bind(this);
        this.closeServerErrorMessage = this.closeServerErrorMessage.bind(this);
        this.openPostCreatedMessage = this.openPostCreatedMessage.bind(this);
        this.closePostCreatedMessage = this.closePostCreatedMessage.bind(this);
        this.openFeedbackModal = this.openFeedbackModal.bind(this);
        this.closeFeedbackModal = this.closeFeedbackModal.bind(this);
        this.openFeedbackIsSentMessage = this.openFeedbackIsSentMessage.bind(this);
        this.closeFeedbackIsSentMessage = this.closeFeedbackIsSentMessage.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.togglePostLike = this.togglePostLike.bind(this);
    }

    Api = new Api();

    componentDidMount(): void {
        this.queryPostsChunk(this.state.searchValue);
    }

    setUserInfo(userInfo: IUserInfo | null): void {
        this.props.setUserInfo(userInfo);
    }

    updateUsersPublicInfo(userId: string): void {
        if (!this.props.usersPublicInfo.hasOwnProperty(userId)) {
            this.props.updateUsersPublicInfo(userId);
        }
    }

    queryPostsChunk(searchValue: string): void {
        const postsTakeNumber: number = 5;
        this.setState(
            () => ({ queryPostsPending: true }),
            () => {
                this.Api.queryPosts(this.state.postsStartNumber, postsTakeNumber, this.state.postsStartDate, searchValue)
                    .then((posts: IPost[]) => {
                            this.setState({ queryPostsPending: false, networkError: false });
                            if (posts) {
                                if (posts.length % postsTakeNumber !== 0 || posts.length === 0) {
                                    this.setState(prevState => ({
                                            posts: prevState.posts.concat(posts),
                                            postsStartNumber: prevState.postsStartNumber + postsTakeNumber,
                                            postsStartDate:
                                                prevState.postsStartDate
                                                    ? prevState.postsStartDate
                                                    : posts[0] ? posts[0].date : null,
                                            scrolledToBottom: true,
                                            allPostsViewed: true
                                        })
                                    );
                                } else {
                                    this.setState(prevState => ({
                                            posts: prevState.posts.concat(posts),
                                            postsStartNumber: prevState.postsStartNumber + postsTakeNumber,
                                            scrolledToBottom: false,
                                            postsStartDate:
                                                prevState.postsStartDate
                                                    ? prevState.postsStartDate
                                                    : posts[0] ? posts[0].date : null
                                        })
                                    );
                                }
                            }
                        })
                    .catch(
                        error => this.setState({
                                scrolledToBottom: true,
                                queryPostsPending: false,
                                networkError: true
                            }));
            }
        );
    }

    onScroll(event: React.UIEvent<HTMLDivElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        const scrolledToBottom: boolean = target.scrollHeight - Math.ceil(target.scrollTop) === target.clientHeight;
        if (scrolledToBottom && !this.state.allPostsViewed && !this.state.queryPostsPending) {
            this.setState(() => ({ scrolledToBottom: true }), () => this.queryPostsChunk(this.state.searchValue));
        }
    }

    openCreatePostModal(): void {
        this.setState({ createPostModalIsOpened: true });
    }

    closeCreatePostModal(): void {
        this.setState({ createPostModalIsOpened: false });
    }

    openFeedbackModal(): void {
        this.setState({ feedbackModalIsOpened: true });
    }

    closeFeedbackModal(): void {
        this.setState({ feedbackModalIsOpened: false });
    }

    openServerErrorMessage(): void {
        this.setState({ serverErrorMessageIsOpened: true });
    }

    closeServerErrorMessage(): void {
        this.setState({ serverErrorMessageIsOpened: false });
    }

    openPostCreatedMessage(): void {
        this.setState(
            () => ({
                posts: [],
                postCreatedMessageIsOpened: true,
                postsStartNumber: 0,
                postsStartDate: null,
                allPostsViewed: false,
                scrolledToBottom: false,
                queryPostsPending: false,
                networkError: false
            }),
            () => this.queryPostsChunk(this.state.searchValue)
        );
    }

    closePostCreatedMessage(): void {
        this.setState({ postCreatedMessageIsOpened: false });
    }

    openFeedbackIsSentMessage(): void {
        this.setState({ feedbackIsSentMessageIsOpened: true });
    }

    closeFeedbackIsSentMessage(): void {
        this.setState({ feedbackIsSentMessageIsOpened: false });
    }

    onSearch(searchValue: string): void {
        this.setState(
            () => ({
                    posts: [],
                    postsStartDate: null,
                    postsStartNumber: 0,
                    allPostsViewed: false,
                    scrolledToBottom: false,
                    queryPostsPending: false,
                    networkError: false,
                    searchValue
                }),
            () => {
                this.queryPostsChunk(this.state.searchValue);
            }
        );
    }

    togglePostLike(postId: string, userId: string): void {
        const { posts } = this.state;
        posts.map((post, index) => {
                if (post._id === postId && post.likes) {
                    let newPosts: IPost[] = [...posts];
                    const userIdIndex: number = post.likes.indexOf(userId);
                    userIdIndex === -1
                        ? newPosts[index].likes.push(userId)
                        : newPosts[index].likes.splice(userIdIndex, 1);
                    this.setState({ posts: newPosts });
                }
            });
    }

    render(): JSX.Element | null {
        return (
            <React.Fragment>
                <TopBar userInfo={this.props.userInfo} setUserInfo={this.setUserInfo} onSearch={this.onSearch} />
                {this.state.createPostModalIsOpened && (
                        <CreatePostModal
                            closeModal={this.closeCreatePostModal}
                            showServerErrorMessage={this.openServerErrorMessage}
                            showPostCreatedMessage={this.openPostCreatedMessage}
                        />
                    )}
                {this.state.feedbackModalIsOpened && (
                        <FeedbackModal
                            closeModal={this.closeFeedbackModal}
                            showServerErrorMessage={this.openServerErrorMessage}
                            showFeedbackIsSentMessage={this.openFeedbackIsSentMessage}
                        />
                    )}
                <div className={styles.feedbackButtonContainer} onClick={this.openFeedbackModal}>
                    <div className={styles.feedbackButton}>{"Feedback"}</div>
                    <FaCommentAlt className={styles.feedbackButtonSmallScreen} />
                </div>
                {this.props.userInfo && (
                        <div className={styles.createPostButton} onClick={this.openCreatePostModal}>
                            <FaPlus className={styles.createPostButtonIcon} />
                            <div className={styles.createPostButtonText}>{"Create post"}</div>
                            <FaPlusCircle className={styles.createPostButtonSmallScreen} />
                        </div>
                    )}
                <div
                    className={styles.container}
                    onScroll={this.onScroll}
                >
                    {this.state.posts.length > 0 &&
                        this.state.posts.map(
                            post =>
                                <Post
                                    key={post._id}
                                    post={post}
                                    userInfo={this.props.userInfo}
                                    usersPublicInfo={this.props.usersPublicInfo}
                                    updateUsersPublicInfo={this.updateUsersPublicInfo}
                                    togglePostLike={this.togglePostLike}
                                />
                        )}
                    <div className={styles.bottomLoaderContainer}>
                        {this.state.networkError ? (
                                "Network error"
                            ) : (
                                this.state.scrolledToBottom && (
                                    this.state.allPostsViewed
                                        ? "No more posts"
                                        : <div className={styles.spinner}><FaCopyright /></div>)
                            )}
                    </div>
                </div>
                {this.state.postCreatedMessageIsOpened && (
                        <Toast text={"Post Created."} closeToast={this.closePostCreatedMessage} />
                    )}
                {this.state.feedbackIsSentMessageIsOpened && (
                        <Toast text={"Feedback is sent."} closeToast={this.closeFeedbackIsSentMessage} />
                    )}
                {this.state.serverErrorMessageIsOpened && (
                        <Toast
                            text={"Network or server error."}
                            closeToast={this.closeServerErrorMessage}
                        />
                    )}
            </React.Fragment>
        );
    }
}

export default Main;
