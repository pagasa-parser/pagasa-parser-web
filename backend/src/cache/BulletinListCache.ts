import {PAGASADocument, PagasaScraper} from "pagasa-archiver";
import {PagasaParserWeb} from "../PagasaParserWeb";

export type ExpandedPAGASADocument = PAGASADocument & { link: string };

export class BulletinListCache {

    private static cache: ExpandedPAGASADocument[];
    private static lastCache = 0;
    private static cacheLength = 20000;

    static async get(): Promise<ExpandedPAGASADocument[]> {
        if (this.getAge() > this.cacheLength) {
            try {
                return (this.cache = (await PagasaScraper.listTCBs({
                    headers: {
                        "User-Agent": PagasaParserWeb.userAgent
                    },
                    timeout: this.cache ? 15000 : 60000
                }).then(d => {
                    this.lastCache = Date.now();
                    return d;
                })).map((v) => {
                    return {
                        name: v.name,
                        count: v.count,
                        final: v.final,
                        file: v.file,
                        link: `https://pubfiles.pagasa.dost.gov.ph/tamss/weather/bulletin/${
                            encodeURIComponent(v.file)
                        }`
                    };
                }));
            } catch (e) {
                if (this.cache) {
                    PagasaParserWeb.log.warn("Failed to get live PAGASA information. Using cache instead...");
                    return this.cache;
                } else {
                    throw e;
                }
            }
        } else {
            return this.cache;
        }
    }

    static async getFromFilename(filename: string): Promise<ExpandedPAGASADocument | null> {
        return (this.cache ?? await this.get()).find(v => v.file === filename);
    }

    static getAge(): number {
        return Date.now() - this.lastCache;
    }

}
