import * as fs from "fs-jetpack";
import {PagasaParserWeb} from "../PagasaParserWeb";
import { createCipheriv, randomBytes, createDecipheriv } from "crypto";
import * as path from "path";
import Logger from "bunyan";

export class DebugHandler {

    private static instance = new DebugHandler();
    static get i() { return this.instance; }

    private log : Logger;
    private dataDirectory: string;
    private keyPath: string;

    private key : Buffer;

    private constructor() { }

    initialize(dataDirectory : string) {
        this.log = PagasaParserWeb.log;
        this.dataDirectory = dataDirectory;
        this.keyPath = path.join(this.dataDirectory, "debug.key");

        if (fs.exists(this.keyPath) !== "file") {
            this.createKey();
        } else {
            try {
                const keyB64 = fs.read(this.keyPath);
                this.key = Buffer.from(keyB64, "base64");
                this.log.info("Loaded debug key.");
            } catch (e) {
                this.log.info("Failed to read the debug key.");
            }
        }
    }

    createKey() {
        this.log.info("Creating debug key...");
        this.key = randomBytes(32);
        fs.write(this.keyPath, this.key.toString("base64"));
    }

    encrypt(data: string) : string {
        const iv = randomBytes(16);

        const cipher = createCipheriv("aes-256-gcm", this.key, iv);
        return `${
            iv.toString("base64")
        }:${
            cipher.update(data, "utf8", "base64")
            + cipher.final("base64")
        }:${
            cipher.getAuthTag().toString("base64")
        }`;
    }

    decrypt(data : string) : string {
        const [iv, digest, authTag] = data.split(":");

        if (iv == null || digest == null || authTag == null) {
            throw new Error("Improperly-constructed debug digest.");
        }

        const decipher = createDecipheriv("aes-256-gcm", this.key, Buffer.from(iv, "base64"));
        decipher.setAuthTag(Buffer.from(authTag, "base64"));
        return decipher.update(digest, "base64", "utf8")
            + decipher.final("utf8");
    }

}
