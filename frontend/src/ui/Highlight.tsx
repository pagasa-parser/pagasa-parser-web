import React from "react";
import hljs from "highlight.js/lib/core";
import randomString from "../util/randomString";

import "highlight.js/styles/atom-one-dark.css";
import hljsJSON from "highlight.js/lib/languages/json";
import hljsPlaintext from "highlight.js/lib/languages/plaintext";

hljs.registerLanguage("json", hljsJSON);
hljs.registerLanguage("plaintext", hljsPlaintext);

export default class Highlight extends React.Component<{
    language?: string
}> {

    id : string;

    constructor(props, context) {
        if (props.language == null)
            props.language = "plaintext";
        super(props, context);
        this.id = randomString();
    }

    componentDidUpdate() {
        hljs.highlightElement(document.getElementById(`hljs-${this.id}`));
    }
    componentDidMount() {
        hljs.highlightElement(document.getElementById(`hljs-${this.id}`));
    }

    render() {
        return <pre><code id={`hljs-${this.id}`} className={"language-" + (this.props.language ?? "plaintext")}>
            {this.props.children}
        </code></pre>;
    }

}
