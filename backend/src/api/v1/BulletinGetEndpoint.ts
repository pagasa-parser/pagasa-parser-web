import {ApiEndpoint} from "./ApiEndpoint";
import express from "express";
import {BulletinListCache} from "../../cache/BulletinListCache";
import {BulletinManager} from "../../bulletin/BulletinManager";
import fs from "fs-jetpack";

export class BulletinGetEndpoint extends ApiEndpoint<Buffer> {

    private static instance = new BulletinGetEndpoint();
    static get i() { return this.instance; }

    private constructor() { super(); }

    async handleRequest(req: express.Request, res: express.Response): Promise<void> {
        if (req.params.bulletin != null) {
            res.set("Content-Type", "application/pdf");
            const bulletin = await BulletinListCache.getFromFilename(req.params.bulletin);
            if (bulletin == null) {
                this.sendError(res, "The requested bulletin is not available on PAGASA's file server.", 404);
                return;
            }

            if (!BulletinManager.i.has(bulletin)) {
                this.sendError(res, "The bulletin has not yet been cached with GET bulletin/download.", 412);
                return;
            }

            this.send(res, fs.read(BulletinManager.i.getPDFPath(bulletin), "buffer"));
        } else {
            res.set("Content-Type", "application/json");
            this.sendError(res, "The bulletin to download was not provided.", 400);
        }
    }

}
