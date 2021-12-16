import Logger from "bunyan";
import bunyanFormat from "bunyan-format";
import express from "express";
import * as path from "path";
import type * as net from "net";
import {BulletinListEndpoint} from "./api/v1/BulletinListEndpoint";
import {ApiEndpoint} from "./api/v1/ApiEndpoint";
import axios from "axios";
import * as fs from "fs-jetpack";
import {DebugHandler} from "./debug/DebugHandler";
import bodyParser from "body-parser";
import multer from "multer";
import {DebugDecryptEndpoint} from "./api/v1/DebugDecryptEndpoint";
import {BulletinDownloadEndpoint} from "./api/v1/BulletinDownloadEndpoint";
import {BulletinManager} from "./bulletin/BulletinManager";
import {BulletinParseEndpoint} from "./api/v1/BulletinParseEndpoint";
import {BulletinHasEndpoint} from "./api/v1/BulletinHasEndpoint";
import {FormatWikipediaEndpoint} from "./api/v1/FormatWikipediaEndpoint";

const packageInfo = require("../package.json");

export { ExpandedPAGASADocument } from "./cache/BulletinListCache";

export class PagasaParserWeb {

    static log : Logger;
    static app : express.Application;
    static server : net.Server;

    static readonly userAgent = `pagasa-parser-web (https://pagasa.chlod.net; chlod@chlod.net) axios/${
        packageInfo.dependencies.axios.replace(/\^/g, "")
    }; node/${
        process.version
    }`;
    static readonly activeApiVersion = "v1";
    static readonly dataDirectory = path.join(__dirname, "..", "data");

    static async start() {
        this.log = Logger.createLogger({
            name: "PAGASA Parser Web",
            level: process.env.NODE_ENV === "development" ? 10 : 30,
            stream: bunyanFormat({
                outputMode: "long",
                levelInString: true
            }, process.stdout)
        });

        if (fs.exists(this.dataDirectory) !== "dir") {
            this.log.info("Creating data directory...");
            fs.dir(this.dataDirectory);
        }
        BulletinManager.i.initialize(this.dataDirectory);
        DebugHandler.i.initialize(this.dataDirectory);

        axios.defaults.headers.common["User-Agent"] = this.userAgent;
        this.log.info(`Server started at ${new Date().toUTCString()}`)

        this.app = express();

        // Middleware
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use((req, res, next) => {
            this.log.info(`${req.method} ${req.header("x-forwarded-for") ?? req.ip} ${req.path}`);
            next();
        });

        // Static
        this.app.use("/", express.static(path.join(__dirname, "..", "static")));

        // Redirect to active API version.
        this.app.all(/^\/api\/(?!v\d*)/, (req, res) => {
            res.redirect(`/api/${
                this.activeApiVersion
            }${req.path.replace(/^\/api(.+)$/, "$1")}`);
        });

        // API Endpoints
        this.app.get("/api/v1/bulletin/list", ApiEndpoint.transform(BulletinListEndpoint.i));
        this.app.get("/api/v1/bulletin/download/:bulletin", ApiEndpoint.transform(BulletinDownloadEndpoint.i));
        this.app.get("/api/v1/bulletin/parse/:bulletin", ApiEndpoint.transform(BulletinParseEndpoint.i));
        this.app.get("/api/v1/bulletin/has/:bulletin", ApiEndpoint.transform(BulletinHasEndpoint.i));
        this.app.get("/api/v1/format/json/:bulletin", ApiEndpoint.transform(BulletinParseEndpoint.i));
        this.app.get("/api/v1/format/wikipedia/:bulletin", ApiEndpoint.transform(FormatWikipediaEndpoint.i));

        this.app.post(
            "/api/v1/format/wikipedia",
            multer({
                limits: { fileSize: 1048576 }
            }).single("json"),
            ApiEndpoint.transform(FormatWikipediaEndpoint.i)
        );

        this.app.post("/api/v1/debug/decrypt", ApiEndpoint.transform(DebugDecryptEndpoint.i));

        this.server = this.app.listen(process.env.PORT ?? 12464, () => {
            this.log.info(`Server started on port ${process.env.PORT ?? 12464}.`);
        });
    }

    static async stop() {
        this.log.info("Stopping...");
        this.server.close();
    }

}

PagasaParserWeb.start();

process.once("SIGINT", function () {
    PagasaParserWeb.stop();
});
process.once("SIGTERM", function () {
    PagasaParserWeb.stop();
});
