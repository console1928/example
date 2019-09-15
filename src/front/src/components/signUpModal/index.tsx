import React from "react";
import { FaRegTimesCircle, FaCopyright } from "react-icons/fa";
import styles from "./signUpModal.module.css";
import { IUserInfo } from "../../types";
import Api from "../../api";

interface ISignUpModalProps {
    closeModal: () => void;
    setUserInfo: (userInfo: IUserInfo) => void;
}

interface ISignUpModalState {
    userName: string | null;
    password: string | null;
    repeatedPassword: string | null;
    firstName: string | null;
    lastName: string | null;
    signUpInfoIsWrong: boolean;
    repeatedPasswordIsWrong: boolean;
    signUpIsPending: boolean;
}

class SignUpModal extends React.Component<ISignUpModalProps, ISignUpModalState> {
    constructor(props: ISignUpModalProps, state: ISignUpModalState) {
        super(props, state);

        this.state = {
            userName: null,
            password: null,
            repeatedPassword: null,
            firstName: null,
            lastName: null,
            signUpInfoIsWrong: false,
            repeatedPasswordIsWrong: false,
            signUpIsPending: false
        };

        this.inputContainerRef = null;

        this.handleClickOutsideInputContainer = this.handleClickOutsideInputContainer.bind(this);
        this.onEscapePress = this.onEscapePress.bind(this);
        this.signUp = this.signUp.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setUserName = this.setUserName.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setRepeatedPassword = this.setRepeatedPassword.bind(this);
        this.setFirstName = this.setFirstName.bind(this);
        this.setLastName = this.setLastName.bind(this);
        this.removeWrongSignUpInfoMessage = this.removeWrongSignUpInfoMessage.bind(this);
        this.removeWrongRepeatedPasswordMessage = this.removeWrongRepeatedPasswordMessage.bind(this);
    }

    inputContainerRef: any = null;

    Api = new Api();

    componentDidMount(): void {
        document.addEventListener("mousedown", this.handleClickOutsideInputContainer);
        document.addEventListener("keydown", this.onEscapePress);
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

    signUp(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        this.removeWrongRepeatedPasswordMessage();
        this.removeWrongSignUpInfoMessage();
        const { userName, password, repeatedPassword, firstName, lastName } = this.state;

        if (userName && password && repeatedPassword && firstName && lastName) {
            if (password === repeatedPassword) {
                this.setState({ signUpIsPending: true });
                this.Api
                    .signUp(userName, password, firstName, lastName)
                    .then(() => this.Api.login(userName, password))
                    .then(this.Api.getUserInfo)
                    .then((userInfo: IUserInfo) => {
                            this.setState({ signUpIsPending: false });
                            this.props.setUserInfo(userInfo);
                        })
                    .then(this.props.closeModal)
                    .catch(error => {
                            console.error(error);
                            this.setState({ signUpInfoIsWrong: true, signUpIsPending: false });
                        });
            } else {
                this.setState({ repeatedPasswordIsWrong: true });
            }
        }
    }

    closeModal(): void {
        this.props.closeModal();
    }

    setUserName(event: React.FormEvent<HTMLDivElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.removeWrongSignUpInfoMessage();
        this.setState({ userName: target.value });
    }

    setPassword(event: React.FormEvent<HTMLDivElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.removeWrongRepeatedPasswordMessage();
        this.removeWrongSignUpInfoMessage();
        this.setState({ password: target.value });
    }

    setRepeatedPassword(event: React.FormEvent<HTMLDivElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.removeWrongRepeatedPasswordMessage();
        this.removeWrongSignUpInfoMessage();
        this.setState({ repeatedPassword: target.value });
    }

    setFirstName(event: React.FormEvent<HTMLDivElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.removeWrongSignUpInfoMessage();
        this.setState({ firstName: target.value });
    }

    setLastName(event: React.FormEvent<HTMLDivElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.removeWrongSignUpInfoMessage();
        this.setState({ lastName: target.value });
    }

    removeWrongSignUpInfoMessage(): void {
        if (this.state.signUpInfoIsWrong) {
            this.setState({ signUpInfoIsWrong: false });
        }
    }

    removeWrongRepeatedPasswordMessage(): void {
        if (this.state.repeatedPasswordIsWrong) {
            this.setState({ repeatedPasswordIsWrong: false });
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
                    <form className={styles.inputForm} onSubmit={this.signUp}>
                        <div className={styles.inputFieldContainer}>
                            <div className={styles.inputFieldLabel}>
                                {"User Name"}
                                <span className={styles.inputFieldRequired}>{" *"}</span>
                            </div>
                            <input
                                className={this.state.signUpInfoIsWrong ? styles.inputFieldError : styles.inputField}
                                type={"text"}
                                required={true}
                                onChange={this.setUserName}
                                value={this.state.userName || ""}
                            />
                        </div>
                        <div className={styles.inputFieldContainer}>
                            <div className={styles.inputFieldLabel}>
                                {"Password"}
                                <span className={styles.inputFieldRequired}>{" *"}</span>
                            </div>
                            <input
                                className={this.state.signUpInfoIsWrong ? styles.inputFieldError : styles.inputField}
                                type={"text"}
                                required={true}
                                onChange={this.setPassword}
                                value={this.state.password || ""}
                            />
                        </div>
                        <div className={styles.inputFieldContainer}>
                            <div className={styles.inputFieldLabel}>
                                {"Repeat password"}
                                <span className={styles.inputFieldRequired}>{" *"}</span>
                            </div>
                            <input
                                className={
                                    (this.state.signUpInfoIsWrong || this.state.repeatedPasswordIsWrong)
                                        ? styles.inputFieldError
                                        : styles.inputField
                                }
                                type={"text"}
                                required={true}
                                onChange={this.setRepeatedPassword}
                                value={this.state.repeatedPassword || ""}
                            />
                        </div>
                        <div className={styles.inputFieldContainer}>
                            <div className={styles.inputFieldLabel}>
                                {"First Name"}
                                <span className={styles.inputFieldRequired}>{" *"}</span>
                            </div>
                            <input
                                className={this.state.signUpInfoIsWrong ? styles.inputFieldError : styles.inputField}
                                type={"text"}
                                required={true}
                                onChange={this.setFirstName}
                                value={this.state.firstName || ""}
                            />
                        </div>
                        <div className={styles.inputFieldContainer}>
                            <div className={styles.inputFieldLabel}>
                                {"Last Name"}
                                <span className={styles.inputFieldRequired}>{" *"}</span>
                            </div>
                            <input
                                className={this.state.signUpInfoIsWrong ? styles.inputFieldError : styles.inputField}
                                type={"text"}
                                required={true}
                                onChange={this.setLastName}
                                value={this.state.lastName || ""}
                            />
                        </div>
                        <div className={styles.errorMessageContainer}>
                            {this.state.signUpInfoIsWrong && (
                                    <div className={styles.errorMessage}>{"Username already exists"}</div>
                                )}
                            {this.state.repeatedPasswordIsWrong && (
                                    <div className={styles.errorMessage}>
                                        {"Repeated password doesn't match the original"}
                                    </div>
                                )}
                        </div>
                        <div className={styles.inputFieldContainer}>
                            {this.state.signUpIsPending &&
                                !this.state.signUpInfoIsWrong ? (
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

export default SignUpModal;
