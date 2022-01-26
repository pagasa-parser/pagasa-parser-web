import {ApiEndpoint} from "./ApiEndpoint";
import express from "express";
import {generateLicenseFile} from "generate-license-file";
import * as path from "path";
import * as fs from "fs-jetpack";

export class MetaLicensesEndpoint extends ApiEndpoint<{ error: false, licenses: string }> {

    private static instance = new MetaLicensesEndpoint();
    static get i() { return this.instance; }

    private constructor() { super(); }

    private readonly packagePath = path.resolve(__dirname, "../../../package.json");
    private readonly licensesPath = path.resolve(__dirname, "../../../data/licenses.txt");
    private licenseText: string;

    async handleRequest(req: express.Request, res: express.Response): Promise<void> {
        if (this.licenseText == null) {
            await generateLicenseFile(this.packagePath, this.licensesPath).then(() => {
                this.licenseText = fs.read(this.licensesPath);
            });
            this.setCache({
                error: false,
                licenses: this.licenseText
            });
        }

        this.sendCache(res);
    }

}
