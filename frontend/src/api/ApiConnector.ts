import type {Bulletin} from "pagasa-parser";
import dateReviver from "../util/dateReviver";
import {ApiResponse} from "../types/APIResponse";
import {ExpandedPAGASADocument} from "../types/ExpandedPAGASADocument";
import ApiError from "./ApiError";
import isBulletin from "../util/isBulletin";

export interface Formatter {
    name: string;
    endpoint: (data?: string | Bulletin | ExpandedPAGASADocument, options?: RequestInit) => Promise<string>;
    endpointLink: string;
    language?: string;
}

export class ApiConnector {

    static readonly formats: Record<string, Formatter> = {
        "json": {
            name: "JSON",
            endpoint: async (data) => {
                if (typeof data === "string")
                    return data;
                else if (isBulletin(data))
                    return JSON.stringify(data, null, 4);
                else
                    return JSON.stringify(await ApiConnector.bulletinParse(data), null, 4);
            },
            endpointLink: "/api/v1/bulletin/parse/$1",
            language: "json"
        },
        "wikipedia": {
            name: "Wikipedia (Template:TyphoonWarningsTable)",
            endpointLink: "/api/v1/format/wikipedia/$1",
            endpoint: ApiConnector.formatWikipedia
        }
    };

    static throwIfError<T>(r: ApiResponse<T>): T {
        if (r.error !== false) {
            throw new ApiError(r.error.message, r.error.details);
        } else {
            return r;
        }
    }

    static async bulletinList(options?: RequestInit): Promise<[ExpandedPAGASADocument[], number]> {
        return fetch("/api/v1/bulletin/list", options)
            .then(d => d.json())
            .then((j: ApiResponse<{ bulletins: ExpandedPAGASADocument[], age: number }>) => this.throwIfError(j))
            .then(r => [r.bulletins, r.age]);
    }

    static async bulletinHas(bulletin: ExpandedPAGASADocument, options?: RequestInit): Promise<{ downloaded: boolean, parsed: boolean }> {
        return fetch(`/api/v1/bulletin/has/${encodeURIComponent(bulletin.file)}`, options)
            .then(d => d.json())
            .then((r: ApiResponse<{ downloaded: boolean, parsed: boolean }>) => this.throwIfError(r));
    }

    static async bulletinDownload(bulletin: ExpandedPAGASADocument, options?: RequestInit): Promise<{ downloaded: boolean }> {
        return fetch(`/api/v1/bulletin/download/${encodeURIComponent(bulletin.file)}`, options)
            .then(d => d.text())
            .then(t => JSON.parse(t, dateReviver))
            .then((j: ApiResponse<{ downloaded: boolean }>) => this.throwIfError(j));
    }

    static async bulletinParse(bulletin: ExpandedPAGASADocument, options?: RequestInit): Promise<Bulletin> {
        return fetch(`/api/v1/bulletin/parse/${encodeURIComponent(bulletin.file)}`, options)
            .then(d => d.text())
            .then(t => JSON.parse(t, dateReviver))
            .then((j: ApiResponse<{ bulletin: Bulletin }>) => this.throwIfError(j))
            .then((r) => r.bulletin);
    }

    static async formatWikipedia(data?: string | Bulletin | ExpandedPAGASADocument, options?: RequestInit): Promise<string> {
        let fetchPromise;

        if (typeof data === "string" || isBulletin(data)) {
            const formData = new FormData();
            const jsonBlob = new Blob([
                typeof data === "string" ? data : JSON.stringify(data)
            ]);
            formData.append("json", jsonBlob, "bulletin.json");

            fetchPromise = fetch("/api/v1/format/wikipedia", Object.assign(options, {
                method: "POST",
                body: formData
            }));
        } else {
            fetchPromise = fetch(`/api/v1/format/wikipedia/${encodeURIComponent(data.file)}`, options);
        }

        return fetchPromise
            .then(d => d.json())
            .then(j => j.wikitext);
    }

}
