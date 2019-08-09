import React from "react";
import { Link } from "react-router-dom";
import styles from "./startPage.module.css";

interface IStartPageProps {}

interface IStartPageState {}

class StartPage extends React.Component<IStartPageProps, IStartPageState> {
    constructor(props: IStartPageProps, state: IStartPageState) {
        super(props, state);

        this.state = {};
    }

    render(): JSX.Element | null {
        return (
            <div className={styles.container}>
                <Link to={"/posts"}>{"Jump to blog"}</Link>
            </div>
        );
    }
}

export default StartPage;
