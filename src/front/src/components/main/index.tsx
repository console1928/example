import React from "react";
import styles from "./main.module.css";
import { IUserInfo, IPost } from "../../types";
import Api from "../../api";
import Post from "../post";
import TopBar from "../topBar";

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

        this.setUserInfo = this.setUserInfo.bind(this);
    }

    Api = new Api();

    componentDidMount(): void {
        this.Api.getUserInfo()
            .then((userInfo: IUserInfo) => this.setState({ userInfo }))
            .catch(error => console.error(error));
        this.Api.getPosts(0, 5)
           .then((posts: IPost[]) => this.setState({ posts }));
    }

    setUserInfo(userInfo: IUserInfo | null): void {
        this.setState({ userInfo });
    }

    render(): JSX.Element | null {
        return (
            <React.Fragment>
                <TopBar userInfo={this.state.userInfo} setUserInfo={this.setUserInfo} />
                {this.state.posts && (
                    <div className={styles.container}>
                        {this.state.posts.map(post => <Post key={post._id} post={post} userInfo={this.state.userInfo} />)}
                    </div>
                )}
            </React.Fragment>
        );
    }
}

export default Main;
