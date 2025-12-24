export class CustomError extends Error {
    constructor(message , status = 500 , expose=false , details = null , code = null  ) {
        super(message);

        this.name = this.constructor.name;
        this.status = status;
        this.expose = expose;
        this.details = details;
        this.code = code;
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized') {
        super(message, 401 , true);
    }
}