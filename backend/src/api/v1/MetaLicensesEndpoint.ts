import {ApiEndpoint} from "./ApiEndpoint";
import express from "express";
import {generateLicenseFile} from "generate-license-file";
import * as path from "path";
import * as fs from "fs-jetpack";

export class MetaLicensesEndpoint extends ApiEndpoint<{ error: false, frontend: string, backend: string }> {

    private static instance = new MetaLicensesEndpoint();
    static get i() { return this.instance; }

    private constructor() { super(); }

    private readonly frontendPackagePath = path.resolve(__dirname, "../../../../frontend/package.json");
    private readonly backendPackagePath = path.resolve(__dirname, "../../../package.json");
    private readonly frontendLicensesPath = path.resolve(__dirname, "../../../data/licenses.f.txt");
    private readonly backendLicensesPath = path.resolve(__dirname, "../../../data/licenses.b.txt");
    private frontendLicenseText: string;
    private backendLicenseText: string;

    async handleRequest(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let willSet = false;
        if (this.frontendLicenseText == null) {
            await generateLicenseFile(this.frontendPackagePath, this.frontendLicensesPath).then(() => {
                this.frontendLicenseText = fs.read(this.frontendLicensesPath);
            });
            willSet = true;
        }
        if (this.backendLicenseText == null) {
            await generateLicenseFile(this.backendPackagePath, this.backendLicensesPath).then(() => {
                this.backendLicenseText = fs.read(this.backendLicensesPath);
            });
            willSet = true;
        }

        if (willSet)
            this.setCache({
                error: false,
                frontend: this.frontendLicenseText,
                backend: this.backendLicenseText,
            });

        this.sendCache(res);
    }

}
