export default function (key : string, value: any) : any {
    if (typeof value === "string") {
        if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z/.test(value)) {
            return new Date(value);
        }
    }
    return value;
}
