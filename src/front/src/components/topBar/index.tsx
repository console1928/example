import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import styles from "./topBar.module.css";
import { IUserInfo } from "../../types";
import Api from "../../api";
import LoginModal from "../loginModal";

interface ITopBarProps {
    userInfo: IUserInfo | null;
    setUserInfo: (userInfo: IUserInfo | null) => void;
}

interface ITopBarState {
    loginModalOpened: boolean;
}

class TopBar extends React.Component<ITopBarProps, ITopBarState> {
    constructor(props: ITopBarProps, state: ITopBarState) {
        super(props, state);

        this.state = {
            loginModalOpened: false
        };

        this.renderLoginModal = this.renderLoginModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setUserInfo = this.setUserInfo.bind(this);
        this.logout = this.logout.bind(this);
    }

    Api = new Api();

    renderLoginModal(): void {
        this.setState({ loginModalOpened: true })
    }

    closeModal(): void {
        this.setState({ loginModalOpened: false });
    }

    setUserInfo(userInfo: IUserInfo | null): void {
        this.props.setUserInfo(userInfo);
    }

    logout(): void {
        this.Api.logout()
            .then(() => this.setUserInfo(null));
    }

    render(): JSX.Element | null {
        return (
            <React.Fragment>
                <div className={styles.container}>
                    <div className={styles.homeContainer}>
                        <Link className={styles.link} to={"/"}>
                            <div className={styles.homeIcon}><FaHome /></div>
                        </Link>
                    </div>
                    {this.props.userInfo ? (
                        <div className={styles.signOutContainer}>
                            <div className={styles.userName}>
                                {`${this.props.userInfo.firstName} ${this.props.userInfo.lastName}`}
                            </div>
                            <div className={styles.signOutIcon} onClick={this.logout}><FaSignOutAlt /></div>
                        </div>
                    ) : (
                        <div className={styles.signInContainer}>
                            <div className={styles.signInIcon} onClick={this.renderLoginModal}><FaSignInAlt /></div>
                        </div>
                    )}
                </div>
                {this.state.loginModalOpened && (
                        <LoginModal closeModal={this.closeModal} setUserInfo={this.setUserInfo} />
                    )}
            </React.Fragment>
        );
    }
}

export default TopBar;
