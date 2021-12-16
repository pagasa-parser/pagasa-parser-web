import React from "react";
import Header from "./Header";
import Body from "./Body";
import { ActiveBulletin } from "../types/ActiveBulletin";
import {ExpandedPAGASADocument} from "../types/ExpandedPAGASADocument";
import AppContext from "./AppContext";
import ErrorModal from "./ErrorModal";

import "../css/global.css";

export interface AppState {
    activeBulletin?: ActiveBulletin;
    availableBulletins?: ExpandedPAGASADocument[];
    bulletinListAge?: number;
}

export default class App extends React.Component<{}, AppState> {

    private static instance;
    public static get i() { return this.instance; }

    private readonly errorModal: React.RefObject<ErrorModal>;

    constructor(props, context) {
        super(props, context);
        App.instance = this;

        this.state = {
            activeBulletin: null,
            availableBulletins: null
        };

        this.errorModal = React.createRef();
    }

    showError(error : Error) {
        this.errorModal.current.open(error);
    }

    render() {
        return <AppContext.Provider value={this}>
            <ErrorModal ref={this.errorModal} />
            <Header />
            <Body />
        </AppContext.Provider>;
    }

}

