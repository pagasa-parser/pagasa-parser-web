import React, {Context} from "react";
import hljs from "highlight.js/lib/core";
import randomString from "../util/randomString";

import "highlight.js/styles/atom-one-dark.css";
import hljsJSON from "highlight.js/lib/languages/json";
import hljsPlaintext from "highlight.js/lib/languages/plaintext";
import App from "./App";

hljs.registerLanguage("json", hljsJSON);
hljs.registerLanguage("plaintext", hljsPlaintext);

interface HighlightProps {
    language?: string;
}

export default class Highlight extends React.Component<HighlightProps> {

    id: string;

    constructor(props: HighlightProps, context: Context<App>) {
        if (props.language == null)
            props.language = "plaintext";
        super(props, context);
        this.id = randomString();
    }

    componentDidUpdate(): void {
        hljs.highlightElement(document.getElementById(`hljs-${this.id}`));
    }
    componentDidMount(): void {
        hljs.highlightElement(document.getElementById(`hljs-${this.id}`));
    }

    render(): JSX.Element {
        return <pre><code id={`hljs-${this.id}`} className={"language-" + (this.props.language ?? "plaintext")}>
            {this.props.children}
        </code></pre>;
    }

}
