import React from "react";
import FileSidebar from "./body/FileSidebar";
import JSONPanel from "./body/JSONPanel";

import "../css/body.css";
import FormatterPanel from "./body/FormatterPanel";

export default function() : JSX.Element {
    const bulletinState = React.useState(null);
    const parsedState = React.useState(null);

    return <main style={{height: "100%"}}>
        <FileSidebar bulletinState={bulletinState} />
        <JSONPanel parsedState={parsedState} bulletinState={bulletinState} />
        <FormatterPanel parsedState={parsedState} bulletinState={bulletinState} />
    </main>
}
