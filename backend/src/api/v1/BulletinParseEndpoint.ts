import {ApiEndpoint, ApiEndpointResponse} from "./ApiEndpoint";
import express from "express";
import {BulletinListCache} from "../../cache/BulletinListCache";
import {BulletinManager} from "../../bulletin/BulletinManager";
import {Bulletin} from "pagasa-parser";

interface BulletinParseEndpointResponse extends ApiEndpointResponse {
    bulletin: Bulletin;
}

export class BulletinParseEndpoint extends ApiEndpoint<BulletinParseEndpointResponse> {

    private static instance = new BulletinParseEndpoint();
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

            this.send(res, {
                error: false,
                bulletin: await BulletinManager.i.parse(bulletin)
            });
        } else {
            this.sendError(res, "A bulletin to download was not provided.", 400);
        }
    }

}
