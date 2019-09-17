import React from "react";
import { Link } from "react-router-dom";
import styles from "./likePopup.module.css";
import { IUserInfo, IUserPublicInfo } from "../../types";
import Api from "../../api";

interface ILikePopupProps {
    userInfo: IUserInfo | null;
    likes: string[];
    isLiked: boolean;
    likesCount: number;
    usersPublicInfo: { [userId: string]: IUserPublicInfo };
    updateUsersPublicInfo: (userId: string) => void;
}

interface ILikePopupState {
    container: HTMLDivElement | null;
    userPicturesCounter: number;
    corruptedUserPictures: string[];
}

class LikePopup extends React.Component<ILikePopupProps, ILikePopupState> {
    constructor(props: ILikePopupProps, state: ILikePopupState) {
        super(props, state);

        this.state = {
            container: null,
            userPicturesCounter: 5,
            corruptedUserPictures: []
        };

        this.likePopupContainerRef = null;

        this.onUserPictureError = this.onUserPictureError.bind(this);
        this.currentUserIsLoggedIn = this.currentUserIsLoggedIn.bind(this);
    }

    likePopupContainerRef: any = null;

    Api = new Api();

    componentDidMount(): void {
        this.setState({ container: this.likePopupContainerRef });
        for (let userId of this.props.likes) {
            if (!this.props.usersPublicInfo.hasOwnProperty(userId)) {
                this.props.updateUsersPublicInfo(userId);
            }
        }
    }

    onUserPictureError(userId: string): void {
        this.setState({
            userPicturesCounter: this.state.userPicturesCounter + 1,
            corruptedUserPictures: [...this.state.corruptedUserPictures, userId]
        });
    }

    currentUserIsLoggedIn(userId: string): boolean {
        return this.props.userInfo ? this.props.userInfo._id === userId : false;
    }

    render(): JSX.Element | null {
        const { userInfo, likes, isLiked, likesCount, usersPublicInfo } = this.props;
        const { userPicturesCounter, corruptedUserPictures } = this.state;
        return (
            <div
                style={{
                    marginLeft: `-${this.state.container ? this.state.container.clientWidth : 0}px`,
                    marginTop: `-${this.state.container ? this.state.container.clientHeight : 0}px`
                }}
                className={styles.container}
                ref={ref => this.likePopupContainerRef = ref}
            >
                {isLiked &&
                    userInfo &&
                    corruptedUserPictures.indexOf(userInfo._id) === -1 && (
                        <Link to={`/user/${userInfo._id}`} className={styles.userPictureContainer}>
                            <img
                                className={styles.userPicture}
                                src={usersPublicInfo[userInfo._id].picture}
                                onError={() => this.onUserPictureError(userInfo._id)}
                            />
                        </Link>)}
                {likes.map((userId, index) => {
                        return index < userPicturesCounter &&
                            usersPublicInfo[userId] &&
                            usersPublicInfo[userId].picture &&
                            corruptedUserPictures.indexOf(userId) === -1 &&
                            !this.currentUserIsLoggedIn(userId) && (
                                <Link key={userId} to={`/user/${userId}`} className={styles.userPictureContainer}>
                                    <img
                                        className={styles.userPicture}
                                        src={usersPublicInfo[userId].picture}
                                        onError={() => this.onUserPictureError(userId)}
                                    />
                                </Link>);
                    })}
                <div className={styles.text}>
                    {likesCount === 0
                        ? "no one liked this yet"
                        : isLiked
                            ? likesCount === 1
                                ? `you liked this`
                                : `you and ${likesCount - 1} more people liked this`
                            : `${likesCount} people liked this`}
                </div>
            </div>
        );
    }
}

export default LikePopup;
