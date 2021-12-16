import React, {useCallback, useEffect} from "react";
import "../../css/sidebar.css";
import {Button, ListGroup, ListGroupItem} from "react-bootstrap";
import {ArrowClockwise, FileEarmarkText} from "react-bootstrap-icons";
import { ExpandedPAGASADocument } from "../../ExpandedPAGASADocument";

export function FileList({ bulletins, bulletinState } : {
    bulletins: ExpandedPAGASADocument[],
    bulletinState
}) {
    const [ activeBulletin, setActiveBulletin ] = bulletinState;
    const changeBulletin = useCallback((bulletin) => {
        setActiveBulletin(bulletin);
    }, [ activeBulletin ]);

    return <ListGroup>
        {bulletins.map(bulletin => <ListGroupItem key={bulletin.file} onClick={() => {
            changeBulletin(bulletin);
        }}>
            <FileEarmarkText height={"21px"} width={"21px"}/> {bulletin.file}
        </ListGroupItem>)}
    </ListGroup>;
}

export default function({ bulletinState } : {
    bulletinState
}) : JSX.Element {
    const [ loaded, setLoaded ] = React.useState(false);
    const [ bulletins, setBulletins ] = React.useState(null);

    const reloadList = useCallback(() => {
        fetch("/api/v1/bulletin/list")
            .then(d => d.json())
            .then(j => {
                setLoaded(true);
                setBulletins(j.bulletins);
            });
    }, [ loaded, bulletins ]);
    useEffect(() => {
        if (!loaded)
            reloadList();
    });


    return <div id={"sidebar"}>
        <div className={"sidebar-head"}>
            <span>Available bulletins</span>
            <Button variant={"outline-secondary"} onClick={reloadList}>
                <ArrowClockwise height={"24px"} />
            </Button>
        </div>
        <div className={"sidebar-list"}>
            {
                bulletins != null && bulletins.length > 0
                ? <FileList bulletins={bulletins}
                            bulletinState={bulletinState} />
                : (
                    <div className={"note"}>{loaded ? "No bulletins found." : "Loading..."}</div>
                )
            }
        </div>
    </div>;
}
