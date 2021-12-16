import path from "path";
import * as fs from "fs-jetpack";
import {ExpandedPAGASADocument} from "../cache/BulletinListCache";
import axios from "axios";
import md5 from "../util/md5";
import PagasaParserPDFSource from "@pagasa-parser/source-pdf";
import {Bulletin} from "pagasa-parser";

export class BulletinManager {

    private static instance = new BulletinManager();
    static get i() { return this.instance; }

    private dataDirectory: string;
    private bulletinsDirectory : string;
    private parsedDirectory : string;

    private constructor() { }

    initialize(dataDirectory : string) {
        this.dataDirectory = dataDirectory;
        this.bulletinsDirectory = path.join(this.dataDirectory, "bulletins");
        this.parsedDirectory = path.join(this.dataDirectory, "parsed");

        if (fs.exists(this.bulletinsDirectory) !== "dir") {
            fs.dir(this.bulletinsDirectory);
        }
        if (fs.exists(this.parsedDirectory) !== "dir") {
            fs.dir(this.parsedDirectory);
        }
    }

    getPDFPath(document :ExpandedPAGASADocument) : string {
        return path.join(this.bulletinsDirectory, md5(document.file) + ".pdf");
    }

    getJSONPath(document : ExpandedPAGASADocument) : string {
        return path.join(this.parsedDirectory, md5(document.file) + ".json");
    }

    has(document: ExpandedPAGASADocument) : boolean {
        return fs.exists(this.getPDFPath(document)) !== false;
    }

    async get(document : ExpandedPAGASADocument) : Promise<string> {
        if (!fs.exists(this.getPDFPath(document))) {
            await this.download(document);
        }
        return this.getPDFPath(document);
    }

    async download(document : ExpandedPAGASADocument) {
        const pdf = await axios(document.link, { responseType: "arraybuffer", timeout: 60000 });
        fs.write(this.getPDFPath(document), pdf.data);
    }

    hasParsed(document : ExpandedPAGASADocument) : boolean {
        return fs.exists(this.getJSONPath(document)) !== false;
    }

    async parse(document : ExpandedPAGASADocument) : Promise<Bulletin> {
        if (this.hasParsed(document))
            return fs.read(this.getJSONPath(document), "jsonWithDates");

        const parser = new PagasaParserPDFSource(this.getPDFPath(document));
        const parsed = await parser.parse();
        parsed.info.url = document.link;

        fs.write(this.getJSONPath(document), JSON.stringify(parsed));

        return parsed;
    }

}
