import {ExpandedPAGASADocument} from "./ExpandedPAGASADocument";
import type {Bulletin} from "pagasa-parser";
import {ApiConnector} from "../api/ApiConnector";

export interface ActiveBulletin {

    bulletin: ExpandedPAGASADocument;
    status?: { downloaded: boolean, parsed: boolean };
    data?: Bulletin;
    formatted?: Record<
        keyof typeof ApiConnector.formats,
        Awaited<ReturnType<(typeof ApiConnector.formats)[keyof typeof ApiConnector]["endpoint"]>>
    >;

}
