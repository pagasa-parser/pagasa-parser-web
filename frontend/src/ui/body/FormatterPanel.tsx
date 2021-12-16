import React, {Fragment, useEffect} from "react";
import Highlight from "react-highlight";

export default function ({ parsedState, bulletinState } : { parsedState, bulletinState }): JSX.Element {
    const [ loading, setLoading ] = React.useState(false);
    const [ lastBulletin, setLastBulletin ] = React.useState(null);
    const [ formatted, setFormatted ] = React.useState(null);
    const [ activeBulletin ] = bulletinState;
    const [ parsed ] = parsedState;

    useEffect(() => {
        if (!loading && parsed && activeBulletin !== lastBulletin) {
            setLoading(true);
            const formData = new FormData();
            const jsonBlob = new Blob([ JSON.stringify(parsed) ]);
            formData.append("json", jsonBlob, "bulletin.json");

            fetch("/api/v1/format/wikipedia", {
                method: "POST",
                body: formData
            })
                .then(d => d.json())
                .then(j => {
                    setFormatted(j.wikitext);
                    setLastBulletin(activeBulletin);
                    setLoading(false);
                })
        }
    });

    return <div id={"formatterPanel"}>
        {parsed && (
            formatted ? <Fragment>
                <h1>Wikitext</h1>
                <Highlight className={"language-plaintext"}>
                    {formatted}
                </Highlight>
            </Fragment> : <span>Loading wikitext...</span>
        )}
    </div>;
}
