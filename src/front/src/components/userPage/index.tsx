import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { FaUserCircle } from "react-icons/fa";
import styles from "./userPage.module.css";
import { IUserInfo, IUserPublicInfo } from "../../types";
import TopBar from "../topBar";
import UserInfoModal from "../userInfoModal";
import UserPictureModal from "../userPictureModal";

interface IUserPageProps extends RouteComponentProps {
    userInfo: IUserInfo | null;
    setUserInfo: (userInfo: IUserInfo | null) => void;
    usersPublicInfo: { [userId: string]: IUserPublicInfo };
    updateUsersPublicInfo: (userId: string) => void;
}

interface IUserPageState {
    userPictureModalIsOpened: boolean;
    userInfoModalIsOpened: boolean;
    DefaultUserPictureIsShowing: boolean;
    userId: string;
}

class UserPage extends React.Component<IUserPageProps, IUserPageState> {
    constructor(props: IUserPageProps, state: IUserPageState) {
        super(props, state);

        this.state = {
            userPictureModalIsOpened: false,
            userInfoModalIsOpened: false,
            DefaultUserPictureIsShowing: false,
            userId: this.props.location.pathname.split("/")[2] || ""
        };

        this.setUserInfo = this.setUserInfo.bind(this);
        this.openUserPictureModal = this.openUserPictureModal.bind(this);
        this.closeUserPictureModal = this.closeUserPictureModal.bind(this);
        this.openUserInfoModal = this.openUserInfoModal.bind(this);
        this.closeUserInfoModal = this.closeUserInfoModal.bind(this);
        this.showDefaultUserPicture = this.showDefaultUserPicture.bind(this);
    }

    componentDidMount(): void {
        this.props.updateUsersPublicInfo(this.state.userId);
    }

    componentDidUpdate(prevProps: IUserPageProps, prevState: IUserPageState): void {
        if (
            (prevProps.userInfo &&
                this.props.userInfo &&
                prevProps.userInfo.picture !== this.props.userInfo.picture) ||
                prevProps.location.pathname !== this.props.location.pathname
        ) {
            this.setState({
                DefaultUserPictureIsShowing: false,
                userId: this.props.location.pathname.split("/")[2] || ""
            });
        }
    }

    setUserInfo(userInfo: IUserInfo | null): void {
        this.props.setUserInfo(userInfo);
    }

    openUserPictureModal(): void {
        this.setState({ userPictureModalIsOpened: true });
    }

    closeUserPictureModal(): void {
        this.setState({ userPictureModalIsOpened: false });
    }

    openUserInfoModal(): void {
        this.setState({ userInfoModalIsOpened: true });
    }

    closeUserInfoModal(): void {
        this.setState({ userInfoModalIsOpened: false });
    }

    showDefaultUserPicture(): void {
        this.setState({ DefaultUserPictureIsShowing: true });
    }

    render(): JSX.Element | null {
        const { userId } = this.state;
        const userInfo: IUserPublicInfo | null =
            this.props.userInfo && this.props.userInfo._id === userId
                ? this.props.userInfo
                : (this.props.usersPublicInfo &&
                    this.props.usersPublicInfo[userId] &&
                    this.props.usersPublicInfo[userId]._id === userId)
                        ? this.props.usersPublicInfo[userId]
                        : null;
        return (
            <React.Fragment>
                <TopBar
                    userInfo={this.props.userInfo}
                    setUserInfo={this.setUserInfo}
                />
                <div className={styles.container}>
                    <div className={styles.leftContainer}>
                        <div className={styles.userPictureContainer}>
                            {userInfo && (
                                this.state.DefaultUserPictureIsShowing ? (
                                    <FaUserCircle className={styles.defaultUserPicture} />
                                ) : (
                                    <img
                                        className={styles.userPicture}
                                        src={userInfo.picture}
                                        onError={this.showDefaultUserPicture}
                                    />
                                ))}
                        </div>
                        {this.props.userInfo && this.props.userInfo._id === userId && (
                            <div className={styles.userPictureButton} onClick={this.openUserPictureModal}>
                                {"Edit picture"}
                            </div>)}
                    </div>
                    <div className={styles.rightContainer}>
                        <div className={styles.userName}>
                            {userInfo && `${userInfo.firstName} ${userInfo.lastName}` || ""}
                        </div>
                        <div className={styles.userInfoContainer}>
                            {userInfo && (
                                <ReactMarkdown source={userInfo.info || ""} />)}
                        </div>
                        {this.props.userInfo && this.props.userInfo._id === userId && (
                            <div className={styles.userInfoButton} onClick={this.openUserInfoModal}>
                                {"Edit user info"}
                            </div>)}
                    </div>
                </div>
                {this.state.userInfoModalIsOpened && userInfo && (
                    <UserInfoModal
                        userInfo={userInfo}
                        closeModal={this.closeUserInfoModal}
                        setUserInfo={this.setUserInfo}
                        updateUsersPublicInfo={this.props.updateUsersPublicInfo}
                    />)}
                {this.state.userPictureModalIsOpened && userInfo && (
                    <UserPictureModal
                        userInfo={userInfo}
                        closeModal={this.closeUserPictureModal}
                        setUserInfo={this.setUserInfo}
                        updateUsersPublicInfo={this.props.updateUsersPublicInfo}
                    />)}
            </React.Fragment>
        );
    }
}

export default withRouter(UserPage);
