export default class ApiError extends Error {

    constructor(message, readonly details) {
        super(message);
    }


}
