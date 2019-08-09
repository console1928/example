import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import { IUserInfo } from "./types";
import Main from "./components/main";
import StartPage from "./components/startPage";

interface IRouterProps {}

interface IRouterState {
    userInfo: IUserInfo | null;
}

class Router extends React.Component<IRouterProps, IRouterState> {
    constructor(props: IRouterProps, state: IRouterState) {
        super(props, state);

        this.state = {
            userInfo: null
        };

        this.setUserInfo= this.setUserInfo.bind(this);
    }

    setUserInfo(userInfo: IUserInfo | null): void {
        this.setState({ userInfo });
    }

    render(): JSX.Element {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact={true} path={"/"} component={StartPage} />
                    <Route
                        exact={true}
                        path={"/posts"}
                        render={() => <Main userInfo={this.state.userInfo} setUserInfo={this.setUserInfo} />}
                    />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Router;
