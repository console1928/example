import React from "react";
import styles from "./main.module.css";
import { IUserInfo, IPost } from "../../types";
import Api from "../../api";
import Post from "../post";

interface IMainProps {}

interface IMainState {
    userInfo: IUserInfo | null;
    posts: IPost[] | null;
}

class Main extends React.Component<IMainProps, IMainState> {
    constructor(props: IMainProps, state: IMainState) {
        super(props, state);

        this.state = {
            userInfo: null,
            posts: null
        };
    }

    Api = new Api();

    componentDidMount(): void {
        this.Api.getUserInfo()
            .then((userInfo: IUserInfo) => this.setState({ userInfo }));
        this.Api.getPosts(0, 5)
           .then((posts: IPost[]) => this.setState({ posts }));
    }

    render(): JSX.Element | null {
        return (
            this.state.posts && (
                <div className={styles.container}>
                    {this.state.posts.map(post => <Post key={post._id} post={post} />)}
                </div>
            )
        );
    }
}

export default Main;
