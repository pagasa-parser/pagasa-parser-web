import React, {Fragment, useEffect} from "react";
import type {ExpandedPAGASADocument} from "pagasa-parser-web/build/backend/cache/BulletinListCache";
import FormCheckInput from "react-bootstrap/FormCheckInput";
import {Button, FormCheck} from "react-bootstrap";
import FormCheckLabel from "react-bootstrap/FormCheckLabel";
import Highlight from "react-highlight";
import {Clipboard} from "react-bootstrap-icons";

function checkHas(activeBulletin, callback) : void {
    fetch(`/api/v1/bulletin/has/${encodeURIComponent(activeBulletin.file)}`)
        .then(d => d.json())
        .then(j => {
            callback(j);
        });
}

function getParsed(activeBulletin, callback) : void {
    fetch(`/api/v1/bulletin/parse/${encodeURIComponent(activeBulletin.file)}`)
        .then(d => d.json())
        .then((j) => {
            callback(j.bulletin);
        })
}

function JSONPanelBlank() : JSX.Element {
    return <Fragment>
        <h1>No bulletin selected</h1>
        <p>Select a bulletin from the left-side panel to parse and format it.</p>
    </Fragment>;
}

function JSONPanelLoading({ name } : {name : string}) : JSX.Element {
    return <Fragment>
        <h1>Loading bulletin...</h1>
        <p>Getting information on the {name}...</p>
    </Fragment>;
}

function JSONPanelRequest({ hasState, parsedState, activeBulletin } : {
    hasState,
    parsedState
    activeBulletin: ExpandedPAGASADocument
}) : JSX.Element {
    const [ has, setHas ] = hasState;
    const [ parsed, setParsed ] = parsedState;

    return <Fragment>
        <h1>Bulletin not parsed</h1>
        <p>
            This bulletin hasn't been parsed yet. In order to do this, we need to
            download the bulletin from PAGASA and then process it.
        </p>
        <ol>
            <li className={"parseStep"}>
                <FormCheck>
                    <FormCheckInput disabled checked={has.downloaded} />
                    <FormCheckLabel>Download the bulletin to the parser</FormCheckLabel>
                </FormCheck>
                {!has.downloaded && <Fragment>
                    <span className={"parseStep-help"}>
                        The bulletin has not yet been downloaded. Click on the button below
                        to request a download.
                    </span>
                    <Button className={"parseStep-button"} onClick={(event) => {
                        (event.target as HTMLElement).toggleAttribute("disabled", true);
                        fetch(`/api/v1/bulletin/download/${encodeURIComponent(activeBulletin.file)}`)
                            .then(d => d.json())
                            .then(() => {
                                checkHas(activeBulletin, (j) => {
                                    setHas(j);
                                });
                            })
                    }}>
                        Download
                    </Button>
                </Fragment>}
            </li>
            <li>
                <FormCheck>
                    <FormCheckInput disabled checked={has.parsed} />
                    <FormCheckLabel>Parse the bulletin</FormCheckLabel>
                </FormCheck>
                {has.downloaded && !has.parsed && <Fragment>
                    <span className={"parseStep-help"}>
                        The bulletin has not yet been parsed. Click on the button below
                        to begin parsing.
                    </span>
                    <Button className={"parseStep-button"} onClick={(event) => {
                        (event.target as HTMLElement).toggleAttribute("disabled", true);
                        getParsed(activeBulletin, (j) => {
                            setParsed(j);
                        });
                    }}>
                        Download
                    </Button>
                </Fragment>}
            </li>
        </ol>
    </Fragment>
}

function JSONPanelParsed({ parsed }) : JSX.Element {
    const parsedFormatted = JSON.stringify(parsed, null, 4);

    return <Fragment>
        {window.isSecureContext && <Button style={{float: "right"}} onClick={() => {
            navigator.clipboard.writeText(parsedFormatted);
        }}>
            <Clipboard height={"1em"}/>
        </Button>}
        <h1>JSON</h1>
        <Highlight className={"language-json"}>
            {parsedFormatted}
        </Highlight>
    </Fragment>;
}

export default function({ bulletinState, parsedState } : { bulletinState, parsedState }) : JSX.Element {
    const [ activeBulletin ] = bulletinState;
    const [ lastBulletin, setLastBulletin ] = React.useState(null);
    const [ loading, setLoading ] = React.useState(false);
    const [ has, setHas ] = React.useState(null);
    const [ parsed, setParsed ] = parsedState;

    useEffect(() => {
        if (!loading && lastBulletin !== activeBulletin) {
            if ((has == null || lastBulletin !== activeBulletin) && activeBulletin != null) {
                setLoading(true);
                checkHas(activeBulletin, (j) => {
                    setHas(j);
                    setLastBulletin(activeBulletin);
                    if (j.downloaded && j.parsed) {
                        getParsed(activeBulletin, (j) => {
                            setParsed(j);
                            setLoading(false);
                        });
                    } else {
                        setParsed(null);
                        setLoading(false);
                    }
                });
            }
        }
    });

    return <div id={"jsonPanel"}>
        { activeBulletin == null
            ? <JSONPanelBlank />
            : (loading || has == null || (has.downloaded && has.parsed && parsed == null)
                ? <JSONPanelLoading name={activeBulletin.file} />
                : (parsed != null
                    ? <JSONPanelParsed parsed={parsed} />
                    : <JSONPanelRequest hasState={[has, setHas]}
                                        parsedState={[parsed, setParsed]}
                                        activeBulletin={activeBulletin}/>
                )) }
    </div>;
}
