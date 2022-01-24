export default class ApiError extends Error {

    constructor(message: string, readonly details: string) {
        super(message);
    }


}
