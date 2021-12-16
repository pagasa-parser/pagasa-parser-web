import {ApiEndpoint, ApiEndpointResponse} from "./ApiEndpoint";
import express from "express";
import {BulletinListCache} from "../../cache/BulletinListCache";
import axios from "axios";

interface BulletinListEndpointResponse extends ApiEndpointResponse {
    bulletins: typeof BulletinListCache["cache"]
}

export class BulletinListEndpoint extends ApiEndpoint<BulletinListEndpointResponse> {

    private static instance = new BulletinListEndpoint();
    static get i() { return this.instance; }

    private constructor() { super(); }

    async handleRequest(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        res.set("Content-Type", "application/json");
        if (this.getCacheAge() < 20000) {
            this.sendCache(res);
        } else {
            this.setAndSendCache(res, {
                error: false,
                bulletins: (await BulletinListCache.get())
            });
        }
    }

}
