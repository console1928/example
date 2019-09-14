import React from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { FaHome, FaSignInAlt, FaSignOutAlt, FaUserCircle, FaSearch } from "react-icons/fa";
import styles from "./topBar.module.css";
import { IUserInfo } from "../../types";
import Api from "../../api";
import LoginModal from "../loginModal";
import SignUpModal from "../signUpModal";

interface ITopBarProps extends RouteComponentProps {
    userInfo: IUserInfo | null;
    setUserInfo: (userInfo: IUserInfo | null) => void;
    onSearch?: (searchValue: string) => void;
}

interface ITopBarState {
    loginModalIsOpened: boolean;
    signUpModalIsOpened: boolean;
    searchValue: string;
    searchInputIsActive: boolean;
    DefaultUserPictureIsShowing: boolean;
    topBarMenuIsOpened: boolean;
}

class TopBar extends React.Component<ITopBarProps, ITopBarState> {
    constructor(props: ITopBarProps, state: ITopBarState) {
        super(props, state);

        this.state = {
            loginModalIsOpened: false,
            signUpModalIsOpened: false,
            searchValue: "",
            searchInputIsActive: false,
            DefaultUserPictureIsShowing: false,
            topBarMenuIsOpened: false
        };

        this.topBarMenuRef = null;

        this.handleClickOutsideTopBarMenuContainer = this.handleClickOutsideTopBarMenuContainer.bind(this);
        this.openTopBarMenu = this.openTopBarMenu.bind(this);
        this.closeTopBarMenu = this.closeTopBarMenu.bind(this);
        this.openLoginModal = this.openLoginModal.bind(this);
        this.closeLoginModal = this.closeLoginModal.bind(this);
        this.openSignUpModal = this.openSignUpModal.bind(this);
        this.closeSignUpModal = this.closeSignUpModal.bind(this);
        this.setUserInfo = this.setUserInfo.bind(this);
        this.logout = this.logout.bind(this);
        this.setSearchValue = this.setSearchValue.bind(this);
        this.onSearchKeyPress = this.onSearchKeyPress.bind(this);
        this.onSearchInputFocus = this.onSearchInputFocus.bind(this);
        this.onSearchInputBlur = this.onSearchInputBlur.bind(this);
        this.showDefaultUserPicture = this.showDefaultUserPicture.bind(this);
    }

    topBarMenuRef: any = null;

    Api = new Api();

    componentDidMount(): void {
        document.addEventListener("mousedown", this.handleClickOutsideTopBarMenuContainer);
    }

    componentDidUpdate(prevProps: ITopBarProps, prevState: ITopBarState): void {
        if (
            prevProps.userInfo &&
                this.props.userInfo &&
                prevProps.userInfo.picture !== this.props.userInfo.picture
        ) {
            this.setState({ DefaultUserPictureIsShowing: false });
        }
    }

    componentWillUnmount(): void {
        document.removeEventListener("mousedown", this.handleClickOutsideTopBarMenuContainer);
    }

    handleClickOutsideTopBarMenuContainer(event: UIEvent): void {
        if (this.topBarMenuRef && !this.topBarMenuRef.contains(event.target)) {
            this.closeTopBarMenu();
        }
    }

    openTopBarMenu(): void {
        this.setState({ topBarMenuIsOpened: true });
    }

    closeTopBarMenu(): void {
        this.setState({ topBarMenuIsOpened: false });
    }

    openLoginModal(): void {
        this.setState({ loginModalIsOpened: true });
    }

    closeLoginModal(): void {
        this.setState({ loginModalIsOpened: false });
    }

    openSignUpModal(): void {
        this.setState({ signUpModalIsOpened: true });
    }

    closeSignUpModal(): void {
        this.setState({ signUpModalIsOpened: false });
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

    showDefaultUserPicture(): void {
        this.setState({ DefaultUserPictureIsShowing: true });
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
                        this.props.location.pathname.indexOf("/posts") === -1 && (
                            <Link className={styles.postsLink} to={"/posts"}>{"Jump to blog"}</Link>)}
                    {this.props.userInfo ? (
                        <div className={styles.signOutContainer}>
                            <Link className={styles.userLink} to={`/user/${this.props.userInfo._id}`}>
                                <div className={styles.userIcon}>
                                    {this.state.DefaultUserPictureIsShowing ? (
                                            <FaUserCircle className={styles.defaultUserPicture} />
                                        ) : (
                                            <img
                                                className={styles.userPicture}
                                                src={this.props.userInfo && this.props.userInfo.picture}
                                                onError={this.showDefaultUserPicture}
                                            />
                                        )}
                                </div>
                                <div className={styles.userName}>
                                    {`${this.props.userInfo.firstName} ${this.props.userInfo.lastName}`}
                                </div>
                            </Link>
                            <div className={styles.signOutIcon} onClick={this.openTopBarMenu}><FaSignOutAlt /></div>
                        </div>
                    ) : (
                        <div className={styles.signInContainer}>
                            <div className={styles.signInIcon} onClick={this.openTopBarMenu}><FaSignInAlt /></div>
                        </div>
                    )}
                    {this.props.location &&
                        this.props.location.pathname.indexOf("/posts") !== -1 && (
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
                {this.state.topBarMenuIsOpened && (
                        <div className={styles.menuContainer} ref={ref => this.topBarMenuRef = ref}>
                            {this.props.userInfo ? (
                                    <div
                                        className={styles.menuItem}
                                        onClick={() => { this.logout(); this.closeTopBarMenu(); }}
                                    >
                                        {"Log out"}
                                    </div>
                                ) : (
                                    <React.Fragment>
                                        <div
                                            className={styles.menuItem}
                                            onClick={() => { this.openLoginModal(); this.closeTopBarMenu(); }}
                                        >
                                            {"Log in"}
                                        </div>
                                        <div
                                            className={styles.menuItem}
                                            onClick={() => { this.openSignUpModal(); this.closeTopBarMenu(); }}
                                        >
                                            {"Sign up"}
                                        </div>
                                    </React.Fragment>
                                )}
                        </div>
                    )}
                {this.state.loginModalIsOpened && (
                        <LoginModal closeModal={this.closeLoginModal} setUserInfo={this.setUserInfo} />
                    )}
                {this.state.signUpModalIsOpened && (
                        <SignUpModal closeModal={this.closeSignUpModal} setUserInfo={this.setUserInfo} />
                    )}
            </React.Fragment>
        );
    }
}

export default withRouter(TopBar);
