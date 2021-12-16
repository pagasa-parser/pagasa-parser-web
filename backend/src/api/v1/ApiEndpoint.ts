import express from "express";
import {PagasaParserWeb} from "../../PagasaParserWeb";
import * as util from "util";
import {DebugHandler} from "../../debug/DebugHandler";

export interface ErrorDetails {
    help: string;
    message: string;
    details: string;
}

export interface ApiEndpointResponse {
    error: false | ErrorDetails;
}

const errorHelp = `If this error persists, please email the details to chlod@chlod.net or tweet to @toolfrog.`;

export abstract class ApiEndpoint<T> {

    cacheData : T
    cacheTime : number = 0;

    static transform(endpoint: ApiEndpoint<any>) :
        (req : express.Request, res: express.Response, next: express.NextFunction) => void
    {
        return async (req : express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                await endpoint.handleRequest.call(endpoint, req, res, next);
            } catch (e) {
                PagasaParserWeb.log.error("Error occurred while processing request.", e);
                endpoint.sendError(res, e, 500);
            }
        }
    }

    abstract handleRequest(
        req : express.Request, res: express.Response, next: express.NextFunction
    ) : void | Promise<void>;

    send(res : express.Response, data : T) : void {
        res.send(data);
    }

    sendError(res : express.Response, data : any, statusCode = 400) {
        res.status(statusCode);
        res.set("Content-Type", "application/json");
        res.send({
            error: {
                help: statusCode >= 500 ? errorHelp : undefined,
                message: typeof data === "string" ? data : (data.message ?? data),
                details: typeof data === "string" ? undefined : DebugHandler.i.encrypt(
                    util.inspect(data, { compact: true })
                )
            }
        });
    }

    setCache(data: T) : T {
        this.cacheTime = Date.now();
        return (this.cacheData = data);
    }
    sendCache(res: express.Response) {
        res.send(this.cacheData);
    }
    setAndSendCache(res: express.Response, data: T) {
        res.send(this.cacheData = data);
    }
    getCacheAge() : number {
        return Date.now() - this.cacheTime;
    }

}
