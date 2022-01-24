import React, {Fragment} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Highlight from "./Highlight";
import ApiError from "../api/ApiError";

export interface ErrorModalState {
    open: boolean;
    message?: string;
    details?: string;
}

export default class ErrorModal extends React.Component<{}, ErrorModalState> {

    constructor(props: {}) {
        super(props);
        this.state = { open: false };
    }

    open(error: Error): void {
        if (error instanceof ApiError) {
            this.setState({
                open: true,
                message: error.message,
                details: error.details
            });
        } else {
            this.setState({
                open: true,
                message: error.message,
                details: error.stack
            });
        }
    }

    close(): void {
        this.setState({
            open: false
        });
    }

    render(): JSX.Element {
        return <Modal show={this.state.open} onHide={() => this.close()}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Error occurred
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Oh noes! It looks like an error occurred while trying to perform an action.</p>
                {this.state.message && <p>
                    <code>{this.state.message}</code>
                </p>}
                {this.state.details && <Fragment>
                    <p>
                        If this keeps happening, please contact the developers and give them the
                        following string:
                    </p>
                    <Highlight language={"plaintext"}>{this.state.details}</Highlight>
                </Fragment>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => this.close()}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>;
    }

}
