import React, {Fragment} from "react";

declare global {
    interface Window { ppw: { scripts: [ string, Record<string, string> ][] }; }
}

interface LicensesDisplayState {
    frontendLicenses?: Record<string, string>[];
    backendLicenses?: string;
}

export default class LicensesDisplay extends React.Component<{}, LicensesDisplayState> {

    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        if (!this.state.backendLicenses)
            fetch("/api/v1/meta/licenses")
                .then(d => d.json())
                .then(j => {
                    this.setState({backendLicenses: j["licenses"]});
                });
        if (!this.state.frontendLicenses)
            fetch(`js/licenses.json`)
                .then(d => d.json())
                .then(j => {
                    this.setState({frontendLicenses: j});
                });
    }

    /**
     * Renders the element.
     *
     * @returns The rendered element.
     */
    render(): JSX.Element {
        return <div id="licenses">{
            (this.state.frontendLicenses == null || this.state.backendLicenses == null)
                ? <i>Licenses are being loaded. Please wait.</i>
                : <Fragment>
                    <ul>
                        <li>
                            <a href="#frontend">Frontend licenses</a>
                            <ul>
                                {this.state.frontendLicenses.map((_package, i) => 
                                    <li key={i}>
                                        <a href={"#" + _package.name.replace(/[^A-Z0-9]/gi, "_")}>
                                            {_package.name}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </li>
                        <li>
                            <a href="#backend">Backend licenses</a>
                        </li>
                    </ul>
                    <h1 id="frontend">Frontend licenses</h1>
                    {
                        this.state.frontendLicenses.map((_package, i) => <Fragment key={i}>
                            <a href="#licenses" style={{float: "right"}}>top</a>
                            <h2 id={_package.name.replace(/[^A-Z0-9]/gi, "_")}>
                                <a href={"https://npmjs.com/package/" + _package.name}>{_package.name}</a>
                            </h2>
                            <b>Version:</b> {_package.version}<br/>
                            {_package.author && <Fragment><b>Author:</b> {_package.author}<br/></Fragment> }
                            {_package.repository && <Fragment><b>Repository:</b> {_package.repository}<br/></Fragment> }
                            {_package.license && <Fragment><b>License:</b> {_package.license}<br/></Fragment> }
                            {_package.licenseText && <pre>{_package.licenseText}</pre> }
                            <hr/>
                        </Fragment>)
                    }
                    <h1 id="backend">Backend licenses</h1>
                    <a href="#licenses" style={{float: "right"}}>top</a>
                    <pre>{this.state.backendLicenses}</pre>
                </Fragment>
        }</div>;
    }

}
