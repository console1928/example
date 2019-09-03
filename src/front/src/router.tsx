import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import { IUserInfo, IUserPublicInfo } from "./types";
import Api from "./api";
import Main from "./components/main";
import StartPage from "./components/startPage";

interface IRouterProps {}

interface IRouterState {
    userInfo: IUserInfo | null;
    usersPublicInfo: { [userId: string]: IUserPublicInfo };
}

class Router extends React.Component<IRouterProps, IRouterState> {
    constructor(props: IRouterProps, state: IRouterState) {
        super(props, state);

        this.state = {
            userInfo: null,
            usersPublicInfo: {}
        };

        this.setUserInfo= this.setUserInfo.bind(this);
        this.updateUsersPublicInfo= this.updateUsersPublicInfo.bind(this);
    }

    Api = new Api();
    pendingUsersPublicInfo: string[] = [];

    componentDidMount(): void {
        this.Api.getUserInfo()
            .then((userInfo: IUserInfo) => this.setUserInfo(userInfo))
            .catch(error => console.error(error));
        if (this.state.userInfo && this.state.userInfo._id) {
            this.updateUsersPublicInfo(this.state.userInfo._id);
        }
    }

    componentDidUpdate(prevProps: IRouterProps, prevState: IRouterState): void {
        if (prevState.userInfo !== this.state.userInfo && this.state.userInfo && this.state.userInfo._id) {
            this.updateUsersPublicInfo(this.state.userInfo._id);
        }
    }

    setUserInfo(userInfo: IUserInfo | null): void {
        this.setState({ userInfo });
    }

    updateUsersPublicInfo(userId: string): void {
        if (
            !this.state.usersPublicInfo.hasOwnProperty(userId) &&
                this.pendingUsersPublicInfo.indexOf(userId) === -1
        ) {
            this.pendingUsersPublicInfo = [ ...this.pendingUsersPublicInfo, userId ];
            this.Api.getUserPublicInfo(userId)
                .then((userPublicInfo: IUserPublicInfo) =>
                        this.setState(
                            () => ({ usersPublicInfo: { [userId]: userPublicInfo, ...this.state.usersPublicInfo } }),
                            () => this.pendingUsersPublicInfo.splice(this.pendingUsersPublicInfo.indexOf(userId), 1)
                        )
                    );
        }
    }

    render(): JSX.Element {
        return (
            <BrowserRouter>
                <Switch>
                    <Route
                        exact={true}
                        path={"/"}
                        render={() => <StartPage userInfo={this.state.userInfo} setUserInfo={this.setUserInfo} />}
                    />
                    <Route
                        exact={true}
                        path={"/posts"}
                        render={
                            () =>
                                <Main
                                    userInfo={this.state.userInfo}
                                    setUserInfo={this.setUserInfo}
                                    usersPublicInfo={this.state.usersPublicInfo}
                                    updateUsersPublicInfo={this.updateUsersPublicInfo}
                                />
                        }
                    />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Router;
