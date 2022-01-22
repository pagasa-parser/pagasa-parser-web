import React, {Fragment} from "react";

interface LicensesDisplayState {
    frontendLicenses?: string;
    backendLicenses?: string;
}

export default class LicensesDisplay extends React.Component<any, LicensesDisplayState> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        fetch("/api/v1/meta/licenses")
            .then(d => d.json())
            .then(j => {
                this.setState({
                    frontendLicenses: j["frontend"],
                    backendLicenses: j["backend"]
                });
            });
    }

    /**
     * Renders the element.
     *
     * @returns The rendered element.
     */
    render(): JSX.Element {
        return <Fragment>{
            (this.state.frontendLicenses == null || this.state.backendLicenses == null)
                ? <i>Licenses are being loaded. Please wait.</i>
                : <Fragment>
                    <h1>Frontend licenses</h1>
                    <pre>{this.state.frontendLicenses}</pre>
                    <h1>Backend licenses</h1>
                    <pre>{this.state.backendLicenses}</pre>
                </Fragment>
        }</Fragment>;
    }

}