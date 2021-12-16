import {PAGASADocument, PagasaScraper} from "pagasa-archiver";
import {PagasaParserWeb} from "../PagasaParserWeb";

export type ExpandedPAGASADocument = PAGASADocument & { link: string };

export class BulletinListCache {

    private static cache : ExpandedPAGASADocument[];
    private static lastCache = 0;
    private static cacheLength = 20000;

    static async get() : Promise<ExpandedPAGASADocument[]> {
        if (Date.now() - this.lastCache > this.cacheLength) {
            return (this.cache = (await PagasaScraper.listTCBs({
                headers: {
                    "User-Agent": PagasaParserWeb.userAgent
                }
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
        } else {
            return this.cache;
        }
    }

    static async getFromFilename(filename : string) : Promise<ExpandedPAGASADocument | null> {
        return (await this.get()).find(v => v.file === filename);
    }

}
