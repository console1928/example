import React from "react";
import styles from "./toast.module.css";
import { FaRegTimesCircle } from "react-icons/fa";

interface IToastProps {
    text: string;
    closeToast: () => void;
}

interface IToastState {}

class Toast extends React.Component<IToastProps, IToastState> {
    constructor(props: IToastProps, state: IToastState) {
        super(props, state);

        this.state = {};

        this.toastContainerRef = null;

        this.handleClickOutsideToastContainer = this.handleClickOutsideToastContainer.bind(this);
        this.closeToast = this.closeToast.bind(this);
    }

    toastContainerRef: any = null;

    componentDidMount(): void {
        document.addEventListener("mousedown", this.handleClickOutsideToastContainer);
    }

    componentWillUnmount(): void {
        document.removeEventListener("mousedown", this.handleClickOutsideToastContainer);
    }

    handleClickOutsideToastContainer(event: UIEvent): void {
        if (this.toastContainerRef && !this.toastContainerRef.contains(event.target)) {
            this.closeToast();
          }
    }

    closeToast(): void {
        this.props.closeToast();
    }

    render(): JSX.Element | null {
        return (
            <div className={styles.container} ref={ref => (this.toastContainerRef = ref)}>
                <div className={styles.text}>{this.props.text}</div>
                <div className={styles.closeToastButton} onClick={this.closeToast}><FaRegTimesCircle /></div>
            </div>
        );
    }
}

export default Toast;
