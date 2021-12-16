import {ApiEndpoint, ApiEndpointResponse} from "./ApiEndpoint";
import express from "express";
import {BulletinListCache} from "../../cache/BulletinListCache";
import {BulletinManager} from "../../bulletin/BulletinManager";
import PagasaParserWikipediaFormatter from "@pagasa-parser/formatter-wikipedia";
import dateTimeReviver from "../../util/dateReviver";

interface FormatWikipediaEndpointResponse extends ApiEndpointResponse {
    wikitext: string;
}

export class FormatWikipediaEndpoint extends ApiEndpoint<FormatWikipediaEndpointResponse> {

    private static instance = new FormatWikipediaEndpoint();
    static get i() { return this.instance; }

    private constructor() { super(); }

    async handleRequest(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        res.set("Content-Type", "application/json");

        if (req.params.bulletin != null) {
            const bulletin = await BulletinListCache.getFromFilename(req.params.bulletin);
            if (bulletin == null) {
                this.sendError(res, "The requested bulletin is not available on PAGASA's file server.", 404);
                return;
            }

            if (!BulletinManager.i.has(bulletin)) {
                this.sendError(res, "The bulletin has not yet been cached with GET bulletin/download.", 412)
                return;
            }

            if (!BulletinManager.i.hasParsed(bulletin)) {
                this.sendError(res, "The bulletin has not yet been parsed with GET bulletin/parse.", 412)
                return;
            }

            this.send(res, {
                error: false,
                wikitext: await new PagasaParserWikipediaFormatter()
                    .format(await BulletinManager.i.parse(bulletin))
            });
        } else if (req.file) {
            this.send(res, {
                error: false,
                wikitext: await new PagasaParserWikipediaFormatter()
                    .format(JSON.parse(req.file.buffer.toString("utf8"), dateTimeReviver))
            });
        } else {
            this.sendError(res, "A bulletin to download or parse was not provided.", 400);
        }
    }

}
