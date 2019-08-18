import React from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { FaArrowAltCircleRight } from "react-icons/fa";
import styles from "./startPage.module.css";
import { IUserInfo } from "../../types";
import LoginModal from "../loginModal";

interface IStartPageProps extends RouteComponentProps {
    userInfo: IUserInfo | null;
    setUserInfo: (userInfo: IUserInfo | null) => void;
}

interface IStartPageState {
    loginModalOpened: boolean;
}

class StartPage extends React.Component<IStartPageProps, IStartPageState> {
    constructor(props: IStartPageProps, state: IStartPageState) {
        super(props, state);

        this.state = {
            loginModalOpened: false
        };

        this.renderLoginModal = this.renderLoginModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
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

    closeModal(): void {
        this.setState({ loginModalOpened: false });
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
                        <div className={styles.button}>{"Sign up"}</div>
                    </div>
                    <div className={styles.linkContainer}>
                        <Link className={styles.link} to={"/posts"}>
                            {"Continue to blog"}
                            <div className={styles.linkIcon}><FaArrowAltCircleRight /></div>
                        </Link>
                    </div>
                </div>
                {this.state.loginModalOpened && (
                        <LoginModal closeModal={this.closeModal} setUserInfo={this.setUserInfo} />
                    )}
            </React.Fragment>
        );
    }
}

export default withRouter(StartPage);
