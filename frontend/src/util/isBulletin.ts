import type {Bulletin} from "pagasa-parser";

export default function (obj : any) : obj is Bulletin {
    return obj.cyclone != null && obj.info != null && obj.signals != null;
}
