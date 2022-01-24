import React, {Fragment} from "react";
import AppContext from "../AppContext";
import Button from "react-bootstrap/Button";
import Icon from "../Icon";
import Highlight from "../Highlight";
import {FormSelect} from "react-bootstrap";
import {ApiConnector} from "../../api/ApiConnector";

interface BulletinFormatterPanelHeadProps {
    onFetch: (format: string) => void;
    loading: boolean;
}

export class BulletinFormatterPanelHead extends React.Component<BulletinFormatterPanelHeadProps> {

    selectedFormat: string;

    render(): JSX.Element {
        return <div className={"formatterPanel-head"}>
            <FormSelect id={"formatterPanelFormat"} onChange={(event) => {
                this.selectedFormat = event.target.value;
            }} disabled={this.props.loading}>
                {
                    Object.entries(ApiConnector.formats).map(([id, formatter]) => <option
                        key={id}
                        value={id}
                    >
                        {formatter.name}
                    </option>)
                }
            </FormSelect>
            <Button onClick={() => {
                this.props.onFetch(this.selectedFormat);
            }} disabled={this.props.loading}>
                Format
            </Button>
        </div>;
    }

}

export class BulletinFormatterDisplay extends React.Component<{ format: string }> {

    static contextType = AppContext;
    declare context: React.ContextType<typeof AppContext>;

    private get activeBulletinFormatted() {
        return this.context?.state?.activeBulletin?.formatted;
    }

    render(): JSX.Element {
        const format = ApiConnector.formats[this.props.format];

        return <Fragment>
            <div className={"formatterPanel-displayHead"}>
                <h1>{format.name}</h1>
                <div>
                    <Button onClick={() => {
                        window.open(format.endpointLink.replace(
                            /\$1/g,
                            encodeURIComponent(this.context.state.activeBulletin.bulletin.file)
                        ), "_blank");
                    }}>
                        <Icon icon="link-45deg" />
                    </Button>
                    {window.isSecureContext && <Button onClick={(e) => {
                        navigator.clipboard.writeText(this.activeBulletinFormatted[this.props.format]);
                        const button = (e.currentTarget as HTMLElement);
                        button.style.backgroundColor = "lime";
                        setTimeout(() => {
                            button.style.backgroundColor = "";
                        }, 1500);
                    }}>
                        <Icon icon="clipboard" />
                    </Button>}
                </div>
            </div>
            <Highlight language={format.language}>
                {this.activeBulletinFormatted[this.props.format]}
            </Highlight>
        </Fragment>;
    }

}

export default class BulletinFormatterPanel extends React.Component<{}, { format: string, loading: boolean }> {

    static contextType = AppContext;
    declare context: React.ContextType<typeof AppContext>;

    private get activeBulletin() {
        return this.context?.state?.activeBulletin;
    }

    constructor(props: {}) {
        super(props);
        this.state = { format: "json", loading: false };
    }

    render(): JSX.Element {
        return <Fragment>
            <BulletinFormatterPanelHead onFetch={async (f) => {
                this.setState({
                    loading: true
                });
                if (this.activeBulletin.formatted[f] == null) {
                    this.activeBulletin.formatted[f] =
                        await ApiConnector.formats[f].endpoint(this.activeBulletin.bulletin);
                }
                this.setState({
                    format: f,
                    loading: false
                });
            }} loading={this.state.loading} />
            {this.state.format && <BulletinFormatterDisplay format={this.state.format} />}
        </Fragment>;
    }

}
