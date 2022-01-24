import React from "react";
import FileSidebar from "./body/FileSidebar";

import "../css/body.css";
import BulletinInfoPanel from "./body/BulletinInfoPanel";

export default class Body extends React.Component {

    render(): JSX.Element {
        return <main style={{height: "100%"}}>
            <FileSidebar />
            <BulletinInfoPanel />
        </main>;
    }
}
