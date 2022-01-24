import type {Bulletin} from "pagasa-parser";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function (obj: any): obj is Bulletin {
    return obj.cyclone != null && obj.info != null && obj.signals != null;
}
