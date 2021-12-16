import {ApiEndpoint, ApiEndpointResponse} from "./ApiEndpoint";
import express from "express";
import {BulletinListCache} from "../../cache/BulletinListCache";
import {BulletinManager} from "../../bulletin/BulletinManager";

interface BulletinHasEndpointResponse extends ApiEndpointResponse {
    downloaded: boolean,
    parsed: boolean
}

export class BulletinHasEndpoint extends ApiEndpoint<BulletinHasEndpointResponse> {

    private static instance = new BulletinHasEndpoint();
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

            this.send(res, {
                error: false,
                downloaded: BulletinManager.i.has(bulletin),
                parsed: BulletinManager.i.hasParsed(bulletin)
            });
        } else {
            this.sendError(res, "A bulletin to download was not provided.", 400);
        }
    }

}
