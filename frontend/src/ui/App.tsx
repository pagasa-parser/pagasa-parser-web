import React, {Fragment} from "react";
import Header from "./Header";
import Body from "./Body";

import "../css/global.css";

export default function() : JSX.Element {
    return <Fragment>
        <Header/>
        <Body/>
    </Fragment>;
}
