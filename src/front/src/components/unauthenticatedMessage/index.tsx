import React from "react";
import styles from "./unauthenticatedMessage.module.css";

interface IUnauthenticatedMessageProps {
    closeUnauthenticatedMessage: () => void;
}

interface IUnauthenticatedMessageState {}

class UnauthenticatedMessage extends React.Component<IUnauthenticatedMessageProps, IUnauthenticatedMessageState> {
    constructor(props: IUnauthenticatedMessageProps, state: IUnauthenticatedMessageState) {
        super(props, state);

        this.state = {};

        this.unauthenticatedMessageContainerRef = null;

        this.handleClickOutsideInputContainer = this.handleClickOutsideInputContainer.bind(this);
    }

    unauthenticatedMessageContainerRef: any = null;

    componentDidMount(): void {
        document.addEventListener("mousedown", this.handleClickOutsideInputContainer);
    }

    componentWillUnmount(): void {
        document.removeEventListener("mousedown", this.handleClickOutsideInputContainer);
    }

    handleClickOutsideInputContainer(event: UIEvent): void {
        if (this.unauthenticatedMessageContainerRef && !this.unauthenticatedMessageContainerRef.contains(event.target)) {
            this.props.closeUnauthenticatedMessage();
          }
    }

    render(): JSX.Element | null {
        return (
            <div
                className={styles.container}
                ref={ref => this.unauthenticatedMessageContainerRef = ref}
            >
                {"Log in or sign up to like"}
            </div>
        );
    }
}

export default UnauthenticatedMessage;
