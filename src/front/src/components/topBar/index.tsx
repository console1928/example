import React from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { FaHome, FaSignInAlt, FaSignOutAlt, FaUserCircle, FaSearch } from "react-icons/fa";
import styles from "./topBar.module.css";
import { IUserInfo } from "../../types";
import Api from "../../api";
import LoginModal from "../loginModal";

interface ITopBarProps extends RouteComponentProps {
    userInfo: IUserInfo | null;
    setUserInfo: (userInfo: IUserInfo | null) => void;
    onSearch?: (searchValue: string) => void;
}

interface ITopBarState {
    loginModalOpened: boolean;
    searchValue: string;
    searchInputIsActive: boolean;
}

class TopBar extends React.Component<ITopBarProps, ITopBarState> {
    constructor(props: ITopBarProps, state: ITopBarState) {
        super(props, state);

        this.state = {
            loginModalOpened: false,
            searchValue: "",
            searchInputIsActive: false
        };

        this.renderLoginModal = this.renderLoginModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setUserInfo = this.setUserInfo.bind(this);
        this.logout = this.logout.bind(this);
        this.setSearchValue = this.setSearchValue.bind(this);
        this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
        this.onSearchInputFocus = this.onSearchInputFocus.bind(this);
        this.onSearchInputBlur = this.onSearchInputBlur.bind(this);
    }

    Api = new Api();

    renderLoginModal(): void {
        this.setState({ loginModalOpened: true });
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

    setSearchValue(event: React.FormEvent<HTMLDivElement>): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        this.setState({ searchValue: target.value });
    }

    onSearchKeyPress(event: React.KeyboardEvent): void {
        if (event.charCode === 13 && this.props.onSearch) {
            this.props.onSearch(this.state.searchValue);
        }
    }

    onSearchInputFocus(): void {
        this.setState({ searchInputIsActive: true });
    }

    onSearchInputBlur(): void {
        if (!this.state.searchValue) {
            this.setState({ searchInputIsActive: false });
        }
    }

    render(): JSX.Element | null {
        return (
            <React.Fragment>
                <div className={styles.container}>
                    {!this.props.userInfo && (
                        <div className={styles.homeContainer}>
                            <Link className={styles.link} to={"/"}>
                                <div className={styles.homeIcon}><FaHome /></div>
                            </Link>
                        </div>)}
                    {this.props.location &&
                        this.props.location.pathname !== "/posts" && (
                            <Link className={styles.postsLink} to={"/posts"}>{"Jump to blog"}</Link>)}
                    {this.props.userInfo ? (
                        <div className={styles.signOutContainer}>
                            <Link className={styles.userLink} to={`/user/${this.props.userInfo._id}`}>
                                <div className={styles.userIcon}><FaUserCircle /></div>
                                <div className={styles.userName}>
                                    {`${this.props.userInfo.firstName} ${this.props.userInfo.lastName}`}
                                </div>
                            </Link>
                            <div className={styles.signOutIcon} onClick={this.logout}><FaSignOutAlt /></div>
                        </div>
                    ) : (
                        <div className={styles.signInContainer}>
                            <div className={styles.signInIcon} onClick={this.renderLoginModal}><FaSignInAlt /></div>
                        </div>
                    )}
                    {this.props.location &&
                        this.props.location.pathname === "/posts" && (
                            <div className={styles.searchInputContainer}>
                                <div
                                    className={
                                        this.state.searchInputIsActive
                                            ? styles.searchIconActive
                                            : styles.searchIcon
                                    }
                                >
                                    <FaSearch />
                                </div>
                                <input
                                    className={
                                        this.state.searchInputIsActive
                                            ? styles.searchInputActive
                                            : styles.searchInput
                                    }
                                    type={"text"}
                                    onChange={this.setSearchValue}
                                    onKeyPress={this.onSearchKeyPress}
                                    onFocus={this.onSearchInputFocus}
                                    onBlur={this.onSearchInputBlur}
                                    value={this.state.searchValue || ""}
                                    placeholder={"Search"}
                                />
                            </div>)}
                </div>
                {this.state.loginModalOpened && (
                        <LoginModal closeModal={this.closeModal} setUserInfo={this.setUserInfo} />
                    )}
            </React.Fragment>
        );
    }
}

export default withRouter(TopBar);
