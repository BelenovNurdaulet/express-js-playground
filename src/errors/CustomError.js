const isProd = process.env.NODE_ENV === 'production';

export class CustomError extends Error {
    constructor(message , status = 500 , expose= !isProd , details = null , code = "APP_ERROR"  ) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.expose = expose;
        this.details = details;
        this.code = code;
    }
}

export class ForbiddenError extends CustomError {
    constructor(message = "Access denied") {
        super(message, 403, true, null, "FORBIDDEN");
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message = "Authentication required") {
        super(message, 401, true, null, "UNAUTHORIZED");
    }
}

export class NotFoundError extends CustomError {
    constructor(message = "Resource not found") {
        super(message, 404, true, null, "NOT_FOUND");
    }
}

export class ConflictError extends CustomError {
    constructor(message = "Resource already exists") {
        super(message, 409, true, null, "CONFLICT");
    }
}

export class BadRequestError extends CustomError {
    constructor(message = "Invalid request") {
        super(message, 400, true, null, "BAD_REQUEST");
    }
}

