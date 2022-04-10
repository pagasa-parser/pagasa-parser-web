import {ApiEndpoint} from "./ApiEndpoint";
import express from "express";
import {BulletinListCache} from "../../cache/BulletinListCache";
import {BulletinManager} from "../../bulletin/BulletinManager";
import dateTimeReviver from "../../util/dateReviver";
import PagasaParserFormatterSignals from "@pagasa-parser/formatter-signals";

export class FormatSignalsEndpoint extends ApiEndpoint<Buffer> {

    private static instance = new FormatSignalsEndpoint();
    static get i() { return this.instance; }

    private constructor() { super(); }

    async handleRequest(req: express.Request, res: express.Response): Promise<void> {
        if (req.params.bulletin != null) {
            res.set("Content-Type", "image/svg+xml");
            const bulletin = await BulletinListCache.getFromFilename(req.params.bulletin);
            if (bulletin == null) {
                this.sendError(res, "The requested bulletin is not available on PAGASA's file server.", 404);
                return;
            }

            if (!BulletinManager.i.has(bulletin)) {
                this.sendError(res, "The bulletin has not yet been cached with GET bulletin/download.", 412);
                return;
            }

            if (!BulletinManager.i.hasParsed(bulletin)) {
                this.sendError(res, "The bulletin has not yet been parsed with GET bulletin/parse.", 412);
                return;
            }

            this.send(res, await new PagasaParserFormatterSignals()
                .format(await BulletinManager.i.parse(bulletin)));
        } else if (req.file) {
            res.set("Content-Type", "image/svg+xml");
            this.send(res, await new PagasaParserFormatterSignals()
                .format(JSON.parse(req.file.buffer.toString("utf8"), dateTimeReviver)));
        } else {
            res.set("Content-Type", "application/json");
            this.sendError(res, "A bulletin to download or parse was not provided.", 400);
        }
    }

}
