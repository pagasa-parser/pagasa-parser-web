import {ApiEndpoint, ApiEndpointResponse} from "./ApiEndpoint";
import express from "express";
import {BulletinListCache} from "../../cache/BulletinListCache";

interface BulletinListEndpointResponse extends ApiEndpointResponse {
    bulletins: typeof BulletinListCache["cache"],
    age?: number
}

export class BulletinListEndpoint extends ApiEndpoint<BulletinListEndpointResponse> {

    private static instance = new BulletinListEndpoint();
    static get i(): BulletinListEndpoint { return this.instance; }

    private constructor() { super(); }

    async handleRequest(req: express.Request, res: express.Response): Promise<void> {
        res.set("Content-Type", "application/json");
        if (this.getCacheAge() < 60000 && req.header("Cache-Control") !== "no-cache") {
            this.sendCache(res);
        } else {
            this.setAndSendCache(res, {
                error: false,
                bulletins: (await BulletinListCache.get()),
                age: BulletinListCache.getAge()
            });
        }
    }

}
