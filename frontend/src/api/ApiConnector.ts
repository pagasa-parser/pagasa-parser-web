import type {Bulletin} from "pagasa-parser";
import dateReviver from "../util/dateReviver";
import {ApiResponse} from "../types/APIResponse";
import {ExpandedPAGASADocument} from "../types/ExpandedPAGASADocument";
import ApiError from "./ApiError";
import isBulletin from "../util/isBulletin";
import ImageDisplay from "../ui/displays/ImageDisplay";
import React from "react";

/**
 * The ResourceFormatter takes in a PAGASA bulletin and churns out resource data. Resource
 * data includes signal images and raw bulletin PDFs.
 */
export interface ResourceFormatter {
    name: string;
    endpoint: (data?: string | Bulletin | ExpandedPAGASADocument, options?: RequestInit) =>
        Promise<Blob>;
    endpointLink: string;
    builder?: (formatted: Blob) => JSX.Element;
}

/**
 * The DataFormatter takes in a PAGASA bulletin and churns out textual data. Textual
 * data includes parsed JSON.
 */
export interface DataFormatter {
    name: string;
    endpoint: (data?: string | Bulletin | ExpandedPAGASADocument, options?: RequestInit) => Promise<string>;
    endpointLink: string;
    language?: string;
}

export type Formatter = ResourceFormatter | DataFormatter;

export class ApiConnector {

    static readonly formats: Record<string, Formatter> = {
        "pdf": {
            name: "Original PDF",
            endpoint: async (data): Promise<Blob> => {
                if (typeof data === "string" || isBulletin(data))
                    return new Blob([
                        `<!DOCTYPE html>
                        <html>
                            <body>
                                <h1>No PDF is available for uploaded bulletins.</h1>
                            </body>
                        </html>`,
                    ]);
                else
                    return await ApiConnector.bulletinGet(data);
            },
            endpointLink: "/api/v1/bulletin/get/$1"
        },
        "json": {
            name: "JSON",
            endpoint: async (data): Promise<string> => {
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
        "signals": {
            name: "[EXPERIMENTAL] Storm signal map (SVG)",
            endpoint: ApiConnector.formatSignals,
            endpointLink: "/api/v1/format/signals/$1",
            builder: (data) => React.createElement(ImageDisplay, { data })
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

    static async bulletinGet(bulletin: ExpandedPAGASADocument, options?: RequestInit): Promise<Blob> {
        return fetch(`/api/v1/bulletin/get/${encodeURIComponent(bulletin.file)}`, options)
            .then(d => d.blob());
    }

    static async bulletinParse(bulletin: ExpandedPAGASADocument, options?: RequestInit): Promise<Bulletin> {
        return fetch(`/api/v1/bulletin/parse/${encodeURIComponent(bulletin.file)}`, options)
            .then(d => d.text())
            .then(t => JSON.parse(t, dateReviver))
            .then((j: ApiResponse<{ bulletin: Bulletin }>) => this.throwIfError(j))
            .then((r) => r.bulletin);
    }

    static async formatSignals(
        data?: string | Bulletin | ExpandedPAGASADocument, options?: RequestInit
    ): Promise<Blob> {
        let fetchPromise: Promise<Response>;

        if (typeof data === "string" || isBulletin(data)) {
            const formData = new FormData();
            const jsonBlob = new Blob([
                typeof data === "string" ? data : JSON.stringify(data)
            ]);
            formData.append("json", jsonBlob, "bulletin.json");

            fetchPromise = fetch("/api/v1/format/signals", Object.assign(options, {
                method: "POST",
                body: formData
            }));
        } else {
            fetchPromise = fetch(`/api/v1/format/signals/${encodeURIComponent(data.file)}`, options);
        }

        return fetchPromise.then(d => d.blob());
    }

    static async formatWikipedia(
        data?: string | Bulletin | ExpandedPAGASADocument, options?: RequestInit
    ): Promise<string> {
        let fetchPromise: Promise<Response>;

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
