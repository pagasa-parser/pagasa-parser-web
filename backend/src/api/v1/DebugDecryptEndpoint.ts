import {ApiEndpoint} from "./ApiEndpoint";
import express from "express";
import {DebugHandler} from "../../debug/DebugHandler";

export class DebugDecryptEndpoint extends ApiEndpoint<string> {

    private static instance = new DebugDecryptEndpoint();
    static get i() { return this.instance; }

    private constructor() { super(); }

    async handleRequest(req: express.Request, res: express.Response): Promise<void> {
        res.set("Content-Type", "text/plain");

        if (req.body?.digest == null)
            this.sendError(res, "No digest provided.");
        else
            this.send(res, DebugHandler.i.decrypt(req.body.digest));
    }

}
