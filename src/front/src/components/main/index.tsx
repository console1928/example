import React from "react";
import { FaCopyright } from "react-icons/fa";
import styles from "./main.module.css";
import { IUserInfo, IPost } from "../../types";
import Api from "../../api";
import Post from "../post";
import TopBar from "../topBar";

interface IMainProps {
    userInfo: IUserInfo | null;
    setUserInfo: (userInfo: IUserInfo | null) => void;
}

interface IMainState {
    posts: IPost[];
    postsStartDate: string | null;
    postsStartNumber: number;
    allPostsViewed: boolean;
    scrolledToBottom: boolean;
    queryPostsPending: boolean;
    networkError: boolean;
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
            networkError: false
        };

        this.setUserInfo = this.setUserInfo.bind(this);
        this.queryPostsChunk = this.queryPostsChunk.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    Api = new Api();

    componentDidMount(): void {
        this.queryPostsChunk();
    }

    setUserInfo(userInfo: IUserInfo | null): void {
        this.props.setUserInfo(userInfo);
    }

    queryPostsChunk(): void {
        const postsTakeNumber: number = 5;
        this.setState(
            () => ({ queryPostsPending: true }),
            () => {
                this.Api.queryPosts(this.state.postsStartNumber, postsTakeNumber, this.state.postsStartDate)
                    .then((posts: IPost[]) => {
                            this.setState({ queryPostsPending: false });
                            if (posts) {
                                if (posts.length % postsTakeNumber !== 0) {
                                    if (posts.length > 0) {
                                        this.setState({ allPostsViewed: true });
                                    }
                                    this.setState(prevState => ({
                                            posts: prevState.posts.concat(posts),
                                            postsStartNumber: prevState.postsStartNumber + postsTakeNumber,
                                            postsStartDate: prevState.postsStartDate ? prevState.postsStartDate : posts[0].date
                                        })
                                    );
                                } else {
                                    this.setState(prevState => ({
                                            posts: prevState.posts.concat(posts),
                                            postsStartNumber: prevState.postsStartNumber + postsTakeNumber,
                                            scrolledToBottom: false,
                                            postsStartDate: prevState.postsStartDate ? prevState.postsStartDate : posts[0].date
                                        })
                                    );
                                }
                            }
                        })
                    .catch(error => this.setState({ allPostsViewed: true, queryPostsPending: false, networkError: true }));
            }
        );
    }

    onScroll(event: React.UIEvent<HTMLDivElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        const scrolledToBottom: boolean = target.scrollHeight - Math.ceil(target.scrollTop) === target.clientHeight;
        if (scrolledToBottom && !this.state.allPostsViewed && !this.state.queryPostsPending) {
            this.setState(() => ({ scrolledToBottom: true }), () => this.queryPostsChunk());
        }
    }

    render(): JSX.Element | null {
        return (
            <React.Fragment>
                <TopBar userInfo={this.props.userInfo} setUserInfo={this.setUserInfo} />
                <div
                    className={styles.container}
                    onScroll={this.onScroll}
                >
                    {this.state.posts.length > 0 &&
                        this.state.posts.map(post => <Post key={post._id} post={post} userInfo={this.props.userInfo} />)}
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
            </React.Fragment>
        );
    }
}

export default Main;
