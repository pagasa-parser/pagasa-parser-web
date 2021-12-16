import React, {Fragment} from "react";
import FormCheckInput from "react-bootstrap/FormCheckInput";
import Button from "react-bootstrap/Button";
import FormCheck from "react-bootstrap/FormCheck";
import FormCheckLabel from "react-bootstrap/FormCheckLabel";
import Highlight from "../Highlight";
import AppContext from "../AppContext";
import {ApiConnector} from "../../api/ApiConnector";
import Icon from "../Icon";
import BulletinFormatterPanel from "./BulletinFormatterPanel";

function BulletinInfoPanelBlank()  {
    return <Fragment>
        <h1>No bulletin selected</h1>
        <p>Select a bulletin from the left-side panel to parse and format it.</p>
    </Fragment>;
}

function BulletinInfoPanelLoading({ name } : {name : string})  {
    return <Fragment>
        <h1>Loading bulletin...</h1>
        <p>Getting information on bulletin "{name}"...</p>
    </Fragment>;
}

class BulletinInfoPanelRequest extends React.Component<{}, {
    downloading: boolean,
    parsing: boolean
}> {

    static contextType = AppContext;
    declare context: React.ContextType<typeof AppContext>;

    constructor(props) {
        super(props);
        this.state = {
            downloading: false,
            parsing: false
        };
    }

    private get activeBulletin() {
        return this.context.state.activeBulletin;
    }
    private get has() {
        return this.activeBulletin.status;
    }

    downloadBulletin() {
        this.setState({
            downloading: true
        });

        ApiConnector.bulletinDownload(this.activeBulletin.bulletin)
            .then(({downloaded}) => {
                this.context.state.activeBulletin.status.downloaded = downloaded;
                this.context.setState({
                    activeBulletin: this.activeBulletin
                });
                this.setState({
                    downloading: false
                });
            })
            .catch((e) => this.context.showError(e));
    }

    parseBulletin() {
        this.setState({
            parsing: true
        });

        ApiConnector.bulletinParse(this.activeBulletin.bulletin)
            .then((bulletin) => {
                this.activeBulletin.data = bulletin;
                this.activeBulletin.status.parsed = true;
                if (this.activeBulletin.formatted == null)
                    this.activeBulletin.formatted = {};
                this.activeBulletin.formatted["json"] = JSON.stringify(bulletin, null, 4);
                this.context.setState({
                    activeBulletin: this.activeBulletin
                });
            })
            .catch((e) => this.context.showError(e));
    }

    render() {
        return <Fragment>
            <h1>Bulletin not parsed</h1>
            <p>
                This bulletin hasn't been parsed yet. In order to do this, we need to
                download the bulletin from PAGASA and then process it.
            </p>
            <ol>
                <li className={"parseStep"}>
                    <FormCheck>
                        <FormCheckInput disabled checked={this.has.downloaded}/>
                        <FormCheckLabel>Download the bulletin to the parser</FormCheckLabel>
                    </FormCheck>
                    {!this.has.downloaded && <Fragment>
                    <span className={"parseStep-help"}>
                        The bulletin has not yet been downloaded. Click on the button below
                        to request a download.
                    </span>
                        <Button
                            className={"parseStep-button"}
                            onClick={() => this.downloadBulletin()}
                            disabled={this.state.downloading}
                        >
                            {this.state.downloading ? "Downloading..." : "Download"}
                        </Button>
                    </Fragment>}
                </li>
                <li>
                    <FormCheck>
                        <FormCheckInput disabled checked={this.has.parsed}/>
                        <FormCheckLabel>Parse the bulletin</FormCheckLabel>
                    </FormCheck>
                    {this.has.downloaded && !this.has.parsed && <Fragment>
                    <span className={"parseStep-help"}>
                        The bulletin has not yet been parsed. Click on the button below
                        to begin parsing.
                    </span>
                        <Button
                            className={"parseStep-button"}
                            onClick={() => this.parseBulletin()}
                            disabled={this.state.parsing}
                        >
                            {this.state.parsing ? "Parsing..." : "Parse"}
                        </Button>
                    </Fragment>}
                </li>
            </ol>
        </Fragment>
    }

}

export default class BulletinInfoPanel extends React.Component {

    static contextType = AppContext;
    declare context: React.ContextType<typeof AppContext>;

    private get activeBulletin() {
        return this.context.state.activeBulletin;
    }

    componentDidUpdate() {
        if (this.activeBulletin != null && this.activeBulletin.status == null) {
            ApiConnector.bulletinHas(this.activeBulletin.bulletin)
                .then((has) => {
                    this.activeBulletin.status = has;
                    this.context.setState({
                        activeBulletin: this.activeBulletin
                    });

                    if (has.downloaded && has.parsed) {
                        ApiConnector.bulletinParse(this.activeBulletin.bulletin)
                            .then((bulletin) => {
                                this.activeBulletin.data = bulletin;
                                if (this.activeBulletin.formatted == null)
                                    this.activeBulletin.formatted = {};
                                this.activeBulletin.formatted["json"] = JSON.stringify(bulletin, null, 4);
                                this.context.setState({
                                    activeBulletin: this.activeBulletin
                                });
                            });
                    }
                });
        }
    }

    render() {
        const activeBulletin = this.activeBulletin;

        let panelInner;

        if (activeBulletin == null) {
            panelInner = <BulletinInfoPanelBlank />;
        } else if (
            activeBulletin.status == null || (
                activeBulletin.status.downloaded
                && activeBulletin.status.parsed
                && activeBulletin.data == null
            )
        ) {
            panelInner = <BulletinInfoPanelLoading name={activeBulletin.bulletin.file} />;
        } else if (!activeBulletin.status.downloaded || !activeBulletin.status.parsed) {
            panelInner = <BulletinInfoPanelRequest />
        } else if (activeBulletin.data != null) {
            panelInner = <BulletinFormatterPanel />;
        } else {
            this.context.showError(new Error("Illegal state: panelInner failed all conditions."));
        }

        return <div id={"bulletinInfoPanel"}>
            {panelInner}
        </div>;
    }
}
