import React from "react";
import { FaRegTimesCircle, FaCopyright } from "react-icons/fa";
import styles from "./loginModal.module.css";
import { IUserInfo } from "../../types";
import Api from "../../api";

interface ILoginModalProps {
    closeModal: () => void;
    setUserInfo: (userInfo: IUserInfo) => void;
}

interface ILoginModalState {
    userName: string | null;
    password: string | null;
    credentialsAreWrong: boolean;
    loginIsPending: boolean;
}

class LoginModal extends React.Component<ILoginModalProps, ILoginModalState> {
    constructor(props: ILoginModalProps, state: ILoginModalState) {
        super(props, state);

        this.state = {
            userName: null,
            password: null,
            credentialsAreWrong: false,
            loginIsPending: false
        };

        this.inputContainerRef = null;

        this.handleClickOutsideInputContainer = this.handleClickOutsideInputContainer.bind(this);
        this.login = this.login.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setUserName = this.setUserName.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.removeWrongCredentialsMessage = this.removeWrongCredentialsMessage.bind(this);
    }

    inputContainerRef: any = null;

    Api = new Api();

    componentDidMount(): void {
        document.addEventListener("mousedown", this.handleClickOutsideInputContainer);
    }

    componentWillUnmount(): void {
        document.removeEventListener("mousedown", this.handleClickOutsideInputContainer);
    }

    handleClickOutsideInputContainer(event: UIEvent): void {
        if (this.inputContainerRef && !this.inputContainerRef.contains(event.target)) {
            this.closeModal();
          }
    }

    login(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        this.removeWrongCredentialsMessage();
        if (this.state.userName && this.state.password) {
            this.setState({ loginIsPending: true });
            this.Api
                .login(this.state.userName, this.state.password)
                .then(this.Api.getUserInfo)
                .then((userInfo: IUserInfo) => {
                        this.setState({ loginIsPending: false });
                        this.props.setUserInfo(userInfo);
                    })
                .then(this.props.closeModal)
                .catch(error => {
                        console.error(error); this.setState({ credentialsAreWrong: true, loginIsPending: false })
                    });
        }
    }

    closeModal(): void {
        this.props.closeModal();
    }

    setUserName(event: React.FormEvent<HTMLDivElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.removeWrongCredentialsMessage();
        this.setState({ userName: target.value });
    }

    setPassword(event: React.FormEvent<HTMLDivElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.removeWrongCredentialsMessage();
        this.setState({ password: target.value });
    }

    removeWrongCredentialsMessage(): void {
        if (this.state.credentialsAreWrong) {
            this.setState({ credentialsAreWrong: false });
        }
    }

    render(): JSX.Element | null {
        return (
            <div className={styles.container}>
                <div
                    className={styles.inputContainer}
                    ref={ref => (this.inputContainerRef = ref)}
                >
                    <div className={styles.inputContainerHeader}>
                        <div
                            className={styles.closeButtonContainer}
                            onClick={this.closeModal}
                        >
                            <FaRegTimesCircle />
                        </div>
                    </div>
                    <form className={styles.inputForm} onSubmit={this.login}>
                        <div className={styles.inputFieldContainer}>
                            <div className={styles.inputFieldLabel}>{"User Name"}</div>
                            <input
                                className={this.state.credentialsAreWrong ? styles.inputFieldError : styles.inputField}
                                type={"text"}
                                required={true}
                                onChange={this.setUserName}
                                value={this.state.userName || ""}
                            />
                        </div>
                        <div className={styles.inputFieldContainer}>
                            <div className={styles.inputFieldLabel}>{"Password"}</div>
                            <input
                                className={this.state.credentialsAreWrong ? styles.inputFieldError : styles.inputField}
                                type={"password"}
                                required={true}
                                onChange={this.setPassword}
                                value={this.state.password || ""}
                            />
                        </div>
                        <div className={styles.wrongCredentialsMessageContainer}>
                            {this.state.credentialsAreWrong && (
                                    <div className={styles.wrongCredentialsMessage}>{"Wrong username or password"}</div>
                                )}
                        </div>
                        <div className={styles.inputFieldContainer}>
                            {this.state.loginIsPending &&
                                !this.state.credentialsAreWrong ? (
                                        <div className={styles.spinner}><FaCopyright /></div>
                                    ) : (
                                        <input className={styles.inputSubmit} type={"submit"} value={"Log in"} />
                                    )}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginModal;
