import React from "react";
import { FaRegTimesCircle, FaCopyright } from "react-icons/fa";
import styles from "./createPostModal.module.css";
import Api from "../../api";

interface ICreatePostModalProps {
    closeModal: () => void;
    showServerErrorMessage: () => void;
    showPostCreatedMessage: () => void;
}

interface ICreatePostModalState {
    postName: string | null;
    postContent: string | null;
    createPostIsPending: boolean;
}

class CreatePostModal extends React.Component<ICreatePostModalProps, ICreatePostModalState> {
    constructor(props: ICreatePostModalProps, state: ICreatePostModalState) {
        super(props, state);

        this.state = {
            postName: null,
            postContent: null,
            createPostIsPending: false
        };

        this.inputContainerRef = null;

        this.handleClickOutsideInputContainer = this.handleClickOutsideInputContainer.bind(this);
        this.createPost = this.createPost.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setPostName = this.setPostName.bind(this);
        this.setPostContent = this.setPostContent.bind(this);
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

    createPost(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (this.state.postName && this.state.postContent) {
            this.setState({ createPostIsPending: true });
            this.Api
                .createPost(this.state.postName, this.state.postContent)
                .then(() => this.setState({ createPostIsPending: false }))
                .then(() => {
                        this.props.showPostCreatedMessage();
                        this.props.closeModal();
                    })
                .catch(error => {
                        console.error(error);
                        this.props.showServerErrorMessage();
                        this.props.closeModal();
                        this.setState({ createPostIsPending: false });
                    });
        }
    }

    closeModal(): void {
        this.props.closeModal();
    }

    setPostName(event: React.FormEvent<HTMLDivElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.setState({ postName: target.value });
    }

    setPostContent(event: React.FormEvent<HTMLTextAreaElement>): void {
        const target: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
        this.setState({ postContent: target.value });
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
                    <form className={styles.inputForm} onSubmit={this.createPost}>
                        <div className={styles.inputFieldContainer}>
                            <div className={styles.inputFieldLabel}>
                                {"Post Name"}
                                <span className={styles.inputFieldRequired}>{" *"}</span>
                            </div>
                            <input
                                className={styles.inputField}
                                type={"text"}
                                required={true}
                                onChange={this.setPostName}
                                value={this.state.postName || ""}
                            />
                        </div>
                        <div className={styles.inputFieldContainer}>
                            <div className={styles.inputFieldLabel}>
                                {"Post content"}
                                <span className={styles.inputFieldRequired}>{" *"}</span>
                            </div>
                            <textarea
                                className={styles.inputTextarea}
                                required={true}
                                onChange={this.setPostContent}
                                value={this.state.postContent || ""}
                            />
                        </div>
                        <div className={styles.inputFieldContainer}>
                            {this.state.createPostIsPending
                                ? (
                                    <div className={styles.spinner}><FaCopyright /></div>
                                ) : (
                                    <input className={styles.inputSubmit} type={"submit"} value={"Create post"} />
                                )}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default CreatePostModal;
