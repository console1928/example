import React from "react";
import { FaRegTimesCircle, FaCopyright } from "react-icons/fa";
import styles from "./userPictureModal.module.css";
import { IUserInfo, IUserPublicInfo } from "../../types";
import Api from "../../api";

interface IUserPictureModalProps {
    userInfo: IUserPublicInfo;
    closeModal: () => void;
    setUserInfo: (userInfo: IUserInfo) => void;
    updateUsersPublicInfo: (userId: string) => void;
}

interface IUserPictureModalState {
    userPicture: string | null;
    userPictureInfoIsWrong: boolean;
    userPictureIsPending: boolean;
}

class UserPictureModal extends React.Component<IUserPictureModalProps, IUserPictureModalState> {
    constructor(props: IUserPictureModalProps, state: IUserPictureModalState) {
        super(props, state);

        this.state = {
            userPicture: null,
            userPictureInfoIsWrong: false,
            userPictureIsPending: false
        };

        this.inputContainerRef = null;

        this.handleClickOutsideInputContainer = this.handleClickOutsideInputContainer.bind(this);
        this.sendUserPicture = this.sendUserPicture.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setUserPicture = this.setUserPicture.bind(this);
        this.removeWrongUserPictureInfoMessage = this.removeWrongUserPictureInfoMessage.bind(this);
    }

    inputContainerRef: any = null;

    Api = new Api();

    componentDidMount(): void {
        document.addEventListener("mousedown", this.handleClickOutsideInputContainer);
    }

    componentDidUpdate(prevProps: IUserPictureModalProps, prevState: IUserPictureModalState): void {
        if (
            prevProps.userInfo &&
                this.props.userInfo &&
                prevProps.userInfo.picture !== this.props.userInfo.picture
        ) {
            this.props.updateUsersPublicInfo(this.props.userInfo._id);
        }
    }

    componentWillUnmount(): void {
        document.removeEventListener("mousedown", this.handleClickOutsideInputContainer);
    }

    handleClickOutsideInputContainer(event: UIEvent): void {
        if (this.inputContainerRef && !this.inputContainerRef.contains(event.target)) {
            this.closeModal();
          }
    }

    sendUserPicture(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        this.removeWrongUserPictureInfoMessage();
        const { userPicture } = this.state;

        if (userPicture) {
            if (userPicture.match("(http(s?):)|([/|.|\w|\s])*\.(?:jpg|jpeg|png)")) {
                this.setState({ userPictureIsPending: true });
                this.Api
                    .setUserPicture(userPicture)
                    .then((userInfo: IUserInfo) => {
                            this.setState({ userPictureIsPending: false });
                            this.props.setUserInfo(userInfo);
                            this.props.updateUsersPublicInfo(this.props.userInfo._id);
                        })
                    .then(this.props.closeModal)
                    .catch(error => {
                            console.error(error);
                            this.setState({ userPictureInfoIsWrong: true, userPictureIsPending: false });
                        });
            } else {
                this.setState({ userPictureInfoIsWrong: true });
            }
        }
    }

    closeModal(): void {
        this.props.closeModal();
    }

    setUserPicture(event: React.FormEvent<HTMLDivElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.removeWrongUserPictureInfoMessage();
        this.setState({ userPicture: target.value });
    }

    removeWrongUserPictureInfoMessage(): void {
        if (this.state.userPictureInfoIsWrong) {
            this.setState({ userPictureInfoIsWrong: false });
        }
    }

    render(): JSX.Element | null {
        return (
            <div className={styles.container}>
                <div
                    className={styles.inputContainer}
                    ref={ref => this.inputContainerRef = ref}
                >
                    <div className={styles.inputContainerHeader}>
                        <div
                            className={styles.closeButtonContainer}
                            onClick={this.closeModal}
                        >
                            <FaRegTimesCircle />
                        </div>
                    </div>
                    <form className={styles.inputForm} onSubmit={this.sendUserPicture}>
                        <div className={styles.inputFieldContainer}>
                            <div className={styles.inputFieldLabel}>
                                {"Set your profile picture"}
                                <span className={styles.inputFieldRequired}>{" *"}</span>
                            </div>
                            <input
                                className={this.state.userPictureInfoIsWrong
                                    ? styles.inputFieldError
                                    : styles.inputField}
                                type={"text"}
                                required={true}
                                onChange={this.setUserPicture}
                                value={this.state.userPicture || ""}
                            />
                        </div>
                        <div className={styles.errorMessageContainer}>
                            {this.state.userPictureInfoIsWrong && (
                                    <div className={styles.errorMessage}>{"Please provide url to your image"}</div>
                                )}
                        </div>
                        <div className={styles.inputFieldContainer}>
                            {this.state.userPictureIsPending &&
                                !this.state.userPictureInfoIsWrong ? (
                                        <div className={styles.spinner}><FaCopyright /></div>
                                    ) : (
                                        <input className={styles.inputSubmit} type={"submit"} value={"Submit"} />
                                    )}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default UserPictureModal;
