import React from "react";
import { FaRegTimesCircle, FaCopyright } from "react-icons/fa";
import styles from "./feedbackModal.module.css";
import Api from "../../api";

interface IFeedbackModalProps {
    closeModal: () => void;
    showServerErrorMessage: () => void;
    showFeedbackIsSentMessage: () => void;
}

interface IFeedbackModalState {
    feedbackText: string | null;
    feedbackIsPending: boolean;
}

class FeedbackModal extends React.Component<IFeedbackModalProps, IFeedbackModalState> {
    constructor(props: IFeedbackModalProps, state: IFeedbackModalState) {
        super(props, state);

        this.state = {
            feedbackText: null,
            feedbackIsPending: false
        };

        this.inputContainerRef = null;

        this.handleClickOutsideInputContainer = this.handleClickOutsideInputContainer.bind(this);
        this.sendFeedback = this.sendFeedback.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setFeedbackText = this.setFeedbackText.bind(this);
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

    sendFeedback(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (this.state.feedbackText) {
            this.setState({ feedbackIsPending: true });
            this.Api
                .sendFeedback(this.state.feedbackText)
                .then(() => this.setState({ feedbackIsPending: false }))
                .then(() => {
                        this.props.showFeedbackIsSentMessage();
                        this.props.closeModal();
                    })
                .catch(error => {
                        console.error(error);
                        this.props.showServerErrorMessage();
                        this.props.closeModal();
                        this.setState({ feedbackIsPending: false });
                    });
        }
    }

    closeModal(): void {
        this.props.closeModal();
    }

    setFeedbackText(event: React.FormEvent<HTMLTextAreaElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.setState({ feedbackText: target.value });
    }

    render(): JSX.Element | null {
        return (
            <div className={styles.container}>
                <div className={styles.inputContainer} ref={ref => this.inputContainerRef = ref}>
                    <div className={styles.inputContainerHeader}>
                        <div
                            className={styles.closeButtonContainer}
                            onClick={this.closeModal}
                        >
                            <FaRegTimesCircle />
                        </div>
                    </div>
                    <form className={styles.inputForm} onSubmit={this.sendFeedback}>
                        <div className={styles.inputFieldContainer}>
                            <div className={styles.inputFieldLabel}>
                                {"Leave your message here"}
                                <span className={styles.inputFieldRequired}>{" *"}</span>
                            </div>
                            <textarea
                                className={styles.inputTextarea}
                                required={true}
                                onChange={this.setFeedbackText}
                                value={this.state.feedbackText || ""}
                            />
                        </div>
                        <div className={styles.inputFieldContainer}>
                            {this.state.feedbackIsPending
                                ? <div className={styles.spinner}><FaCopyright /></div>
                                : <input className={styles.inputSubmit} type={"submit"} value={"Send feedback"} />}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default FeedbackModal;
