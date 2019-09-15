import React from "react";
import { FaRegTimesCircle, FaCopyright } from "react-icons/fa";
import styles from "./userInfoModal.module.css";
import { IUserInfo, IUserPublicInfo } from "../../types";
import Api from "../../api";

interface IUserInfoModalProps {
    userInfo: IUserPublicInfo;
    closeModal: () => void;
    setUserInfo: (userInfo: IUserInfo) => void;
    updateUsersPublicInfo: (userId: string) => void;
}

interface IUserInfoModalState {
    userInfo: string;
    userInfoIsPending: boolean;
}

class UserInfoModal extends React.Component<IUserInfoModalProps, IUserInfoModalState> {
    constructor(props: IUserInfoModalProps, state: IUserInfoModalState) {
        super(props, state);

        this.state = {
            userInfo: this.props.userInfo.info,
            userInfoIsPending: false
        };

        this.inputContainerRef = null;

        this.handleClickOutsideInputContainer = this.handleClickOutsideInputContainer.bind(this);
        this.onEscapePress = this.onEscapePress.bind(this);
        this.sendUserInfo = this.sendUserInfo.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setUserInfo = this.setUserInfo.bind(this);
    }

    inputContainerRef: any = null;

    Api = new Api();

    componentDidMount(): void {
        document.addEventListener("mousedown", this.handleClickOutsideInputContainer);
        document.addEventListener("keydown", this.onEscapePress);
    }

    componentDidUpdate(prevProps: IUserInfoModalProps, prevState: IUserInfoModalState): void {
        if (
            prevProps.userInfo &&
                this.props.userInfo &&
                prevProps.userInfo.info !== this.props.userInfo.info
        ) {
            this.props.updateUsersPublicInfo(this.props.userInfo._id);
        }
    }

    componentWillUnmount(): void {
        document.removeEventListener("mousedown", this.handleClickOutsideInputContainer);
        document.removeEventListener("keydown", this.onEscapePress);
    }

    handleClickOutsideInputContainer(event: UIEvent): void {
        if (this.inputContainerRef && !this.inputContainerRef.contains(event.target)) {
            this.closeModal();
          }
    }

    onEscapePress(event: KeyboardEvent): void {
        if (event.keyCode === 27) {
            this.closeModal();
        }
    }

    sendUserInfo(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        const { userInfo } = this.state;

        if (userInfo) {
            this.setState({ userInfoIsPending: true });
            this.Api
                .setUserInfo(userInfo)
                .then((userInfo: IUserInfo) => {
                        this.setState({ userInfoIsPending: false });
                        this.props.setUserInfo(userInfo);
                    })
                .then(this.props.closeModal)
                .catch(error => {
                        console.error(error);
                        this.setState({ userInfoIsPending: false });
                    });
        }
    }

    closeModal(): void {
        this.props.closeModal();
    }

    setUserInfo(event: React.FormEvent<HTMLTextAreaElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.setState({ userInfo: target.value });
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
                    <form className={styles.inputForm} onSubmit={this.sendUserInfo}>
                        <div className={styles.inputFieldContainer}>
                            <div className={styles.inputFieldLabel}>
                                {"Set your profile info"}
                                <span className={styles.inputFieldRequired}>{" *"}</span>
                            </div>
                            <textarea
                                className={styles.inputTextarea}
                                required={true}
                                onChange={this.setUserInfo}
                                value={this.state.userInfo || ""}
                            />
                        </div>
                        <div className={styles.inputFieldContainer}>
                            {this.state.userInfoIsPending ? (
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

export default UserInfoModal;
