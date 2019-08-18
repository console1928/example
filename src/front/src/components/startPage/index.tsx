import React from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { FaArrowAltCircleRight } from "react-icons/fa";
import styles from "./startPage.module.css";
import { IUserInfo } from "../../types";
import LoginModal from "../loginModal";
import SignUpModal from "../signUpModal";

interface IStartPageProps extends RouteComponentProps {
    userInfo: IUserInfo | null;
    setUserInfo: (userInfo: IUserInfo | null) => void;
}

interface IStartPageState {
    loginModalOpened: boolean;
    signUpModalOpened: boolean;
}

class StartPage extends React.Component<IStartPageProps, IStartPageState> {
    constructor(props: IStartPageProps, state: IStartPageState) {
        super(props, state);

        this.state = {
            loginModalOpened: false,
            signUpModalOpened: false
        };

        this.renderLoginModal = this.renderLoginModal.bind(this);
        this.closeLoginModal = this.closeLoginModal.bind(this);
        this.renderSignUpModal = this.renderSignUpModal.bind(this);
        this.closeSignUpModal = this.closeSignUpModal.bind(this);
        this.setUserInfo = this.setUserInfo.bind(this);
    }

    componentDidMount(): void {
        if (this.props.userInfo) {
            this.props.history.push("/posts");
        }
    }

    componentDidUpdate(prevProps: IStartPageProps, prevState: IStartPageState): void {
        if (this.props.userInfo) {
            this.props.history.push("/posts");
        }
    }

    renderLoginModal(): void {
        this.setState({ loginModalOpened: true });
    }

    renderSignUpModal(): void {
        this.setState({ signUpModalOpened: true });
    }

    closeLoginModal(): void {
        this.setState({ loginModalOpened: false });
    }

    closeSignUpModal(): void {
        this.setState({ signUpModalOpened: false });
    }

    setUserInfo(userInfo: IUserInfo | null): void {
        this.props.setUserInfo(userInfo);
    }

    render(): JSX.Element | null {
        return (
            <React.Fragment>
                <div className={styles.container}>
                    <div>
                        <div
                            className={styles.button}
                            onClick={this.renderLoginModal}
                        >
                            {"Log in"}
                        </div>
                        <div className={styles.middleText}>{"or"}</div>
                        <div
                            className={styles.button}
                            onClick={this.renderSignUpModal}
                        >
                            {"Sign up"}
                        </div>
                    </div>
                    <div className={styles.linkContainer}>
                        <Link className={styles.link} to={"/posts"}>
                            {"Continue to blog"}
                            <div className={styles.linkIcon}><FaArrowAltCircleRight /></div>
                        </Link>
                    </div>
                </div>
                {this.state.signUpModalOpened && (
                        <SignUpModal closeModal={this.closeSignUpModal} setUserInfo={this.setUserInfo} />
                    )}
                {this.state.loginModalOpened && (
                        <LoginModal closeModal={this.closeLoginModal} setUserInfo={this.setUserInfo} />
                    )}
            </React.Fragment>
        );
    }
}

export default withRouter(StartPage);
