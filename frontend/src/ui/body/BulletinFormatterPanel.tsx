import React, {Fragment} from "react";
import AppContext from "../AppContext";
import Button from "react-bootstrap/Button";
import Icon from "../Icon";
import Highlight from "../Highlight";
import {FormSelect} from "react-bootstrap";
import {ApiConnector, DataFormatter, Formatter, ResourceFormatter} from "../../api/ApiConnector";

interface BulletinFormatterPanelHeadProps {
    activeFormat: string;
    onFetch: (format: string) => void;
    loading: boolean;
}

export class BulletinFormatterPanelHead extends React.Component<BulletinFormatterPanelHeadProps> {

    selectedFormat: string;

    render(): JSX.Element {
        return <div className={"formatterPanel-head"}>
            <FormSelect
                id={"formatterPanelFormat"}
                onChange={(event) => {
                    this.selectedFormat = event.target.value;
                }}
                disabled={this.props.loading}
                defaultValue={this.props.activeFormat}
            >
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

    private get activeBulletin() {
        return this.context.state.activeBulletin;
    }
    private get activeBulletinFormatted() {
        return this.context?.state?.activeBulletin?.formatted;
    }

    renderCopyDownloadButton(): JSX.Element {
        const formattedResource = this.activeBulletinFormatted[this.props.format];

        if (formattedResource instanceof Blob) {
            return <Button
                title="Download"
                onClick={() => {
                    const d = document.createElement("a");
                    d.setAttribute("target", "_blank");
                    d.setAttribute("download", this.activeBulletin.bulletin.file);
                    d.setAttribute("href", URL.createObjectURL(formattedResource));
                    d.click();
                }}>
                <Icon icon="download" />
            </Button>;
        } else {
            return <Button
                title={
                    window.isSecureContext
                        ? "Copy to clipboard"
                        : "Cannot copy to clipboard (page is not accessed in a secure context)"}
                disabled={!window.isSecureContext}
                onClick={(e) => {
                    navigator.clipboard.writeText(formattedResource);
                    const button = (e.currentTarget as HTMLElement);
                    button.style.backgroundColor = "lime";
                    setTimeout(() => {
                        button.style.backgroundColor = "";
                    }, 1500);
                }}>
                <Icon icon="clipboard" />
            </Button>;
        }
    }

    renderDisplay(format: Formatter): JSX.Element {
        const formattedResource = this.activeBulletinFormatted[this.props.format];

        if (formattedResource instanceof Blob) {
            return <iframe
                className={"full"}
                src={URL.createObjectURL(formattedResource)}
                onLoad={(event) => {
                    const frameElement = event.currentTarget;
                    if ((format as ResourceFormatter).postLoad)
                        (format as ResourceFormatter).postLoad(frameElement.contentDocument);
                }}
            />;
        } else {
            return <Highlight language={(format as DataFormatter).language}>
                {this.activeBulletinFormatted[this.props.format]}
            </Highlight>;
        }
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
                    {this.renderCopyDownloadButton()}
                </div>
            </div>
            {this.renderDisplay(format)}
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
            <BulletinFormatterPanelHead activeFormat={this.state.format} onFetch={async (f) => {
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
