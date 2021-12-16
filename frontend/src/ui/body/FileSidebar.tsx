import React from "react";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import { ExpandedPAGASADocument } from "../../types/ExpandedPAGASADocument";
import AppContext from "../AppContext";

import "../../css/sidebar.css";
import {ApiConnector} from "../../api/ApiConnector";
import Icon from "../Icon";

export class FileList extends React.Component<{ bulletins: ExpandedPAGASADocument[] }, {}> {

    static contextType = AppContext;
    declare context: React.ContextType<typeof AppContext>;

    render() {
        return <ListGroup>
            {this.props.bulletins.map(bulletin => <ListGroupItem key={bulletin.file} onClick={() => {
                this.context.setState({
                    activeBulletin: {
                        bulletin: bulletin
                    }
                });
            }}>
                <Icon icon="file-earmark-text"/> {bulletin.file}
            </ListGroupItem>)}
        </ListGroup>;
    }
}

export default class FileSidebar extends React.Component {

    static contextType = AppContext;
    declare context: React.ContextType<typeof AppContext>;

    private get availableBulletins() {
        return this.context.state.availableBulletins;
    }

    reload() {
        ApiConnector.bulletinList({
            headers: {
                "Cache-Control": null
            }
        })
            .then(([bulletins, age]) => {
                this.context.setState({
                    availableBulletins: bulletins,
                    bulletinListAge: age
                });
            })
            .catch(e => this.context.showError(e));
    }

    componentDidMount() {
        if (this.availableBulletins == null) {
            this.reload();
        }
    }

    render() {
        let note;
        if (this.context.state.bulletinListAge > 300000 && new Date().getUTCHours() % 3 == 0) {
            note = `The bulletin list was last cached ${Math.round(
                        this.context.state.bulletinListAge / 60000
            )} minutes ago. New bulletins may be available.`;
        } else if (this.availableBulletins != null && this.availableBulletins.length == 0) {
            note = "No bulletins found.";
        } else if (this.availableBulletins == null) {
            note = "Loading...";
        }

        return <div id={"sidebar"}>
            <div className={"sidebar-head"}>
                <span>Available bulletins</span>
                <Button variant={"outline-secondary"} onClick={() => this.reload()}>
                    <Icon icon="arrow-clockwise" />
                </Button>
            </div>
            {note && <div className={"sidebar-note"}>{note}</div>}
            <div className={"sidebar-list"}>
                {this.availableBulletins != null && this.availableBulletins.length > 0 &&
                    <FileList bulletins={this.availableBulletins} />
                }
            </div>
        </div>;
    }

}
