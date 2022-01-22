import React, {Fragment} from "react";
import Modal from "react-bootstrap/esm/Modal";
import Tabs from "react-bootstrap/esm/Tabs";
import Tab from "react-bootstrap/esm/Tab";
import LicensesDisplay from "./LicensesDisplay";

const packageInfo = require("../../package.json");

interface HeaderAboutState {
    aboutOpen: boolean;
}

export default class HeaderAbout extends React.Component<any, HeaderAboutState> {

    constructor(props) {
        super(props);
        this.state = {
            aboutOpen: false
        };
    }

    showAbout() {
        this.setState({ aboutOpen: true });
    }

    hideAbout() {
        this.setState({ aboutOpen: false });
    }

    /**
     * Renders the element.
     *
     * @returns The rendered element.
     */
    render(): JSX.Element {
        return <Fragment>
            <div>
                <div className={"text-white lh-1 fw-bold"}>
                    PAGASA Parser
                </div>
                <div
                    className={"text-white lh-1 text-end"}
                    style={{fontSize: "0.8rem"}}
                >
                    v{packageInfo.version} &#x2022; <span
                        className={"about"}
                        onClick={() => this.showAbout()}
                        role="button"
                    >
                        About
                    </span>
                </div>
            </div>
            <Modal show={this.state.aboutOpen} onHide={() => this.hideAbout()} className={"about-modal"}>
                <Modal.Header closeButton>
                    <Modal.Title>About</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey="about">
                        <Tab eventKey="about" title="About">
                            <p>
                                <i>For more information about the PAGASA Parser project, view the <a href="/">homepage</a>.</i>
                            </p>
                            <p>
                                PAGASA Parser Web is a web backend for the PAGASA parser, used for web-based and
                                graphical data processing.
                            </p>
                            <p>
                                Although this website uses PAGASA data, this project is not affiliated with the
                                Philippine Atmospheric, Geophysical and Astronomical Services Administration.
                            </p>
                            <p>
                                This website is licensed under the <a href="//www.gnu.org/licenses/agpl-3.0.en.html">
                                AGPL v3.0</a>.
                                PAGASA Parser packages licensed under the <a href="//www.apache.org/licenses/LICENSE-2.0.html">
                                Apache License 2.0</a>.
                                Developed and maintained by <a href="//chlod.net">Chlod Alejandro</a>.
                            </p>
                        </Tab>
                        <Tab eventKey="licenses" title="Licenses">
                            <LicensesDisplay />
                        </Tab>
                    </Tabs>
                </Modal.Body>
            </Modal>
        </Fragment>;
    }

}
