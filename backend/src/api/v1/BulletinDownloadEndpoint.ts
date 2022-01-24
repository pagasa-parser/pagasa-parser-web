import {ApiEndpoint, ApiEndpointResponse} from "./ApiEndpoint";
import express from "express";
import {BulletinListCache} from "../../cache/BulletinListCache";
import {BulletinManager} from "../../bulletin/BulletinManager";

interface BulletinDownloadEndpointResponse extends ApiEndpointResponse {
    downloaded: boolean;
}

export class BulletinDownloadEndpoint extends ApiEndpoint<BulletinDownloadEndpointResponse> {

    private static instance = new BulletinDownloadEndpoint();
    static get i() { return this.instance; }

    private constructor() { super(); }

    async handleRequest(req: express.Request, res: express.Response): Promise<void> {
        res.set("Content-Type", "application/json");

        if (req.params.bulletin != null) {
            const bulletin = await BulletinListCache.getFromFilename(req.params.bulletin);
            if (bulletin == null) {
                this.sendError(res, "The requested bulletin is not available on PAGASA's file server.", 404);
                return;
            }

            await BulletinManager.i.get(bulletin);
            this.send(res, {
                error: false,
                downloaded: true
            });
        } else {
            this.sendError(res, "A bulletin to download was not provided.", 400);
        }
    }

}
