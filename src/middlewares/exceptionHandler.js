import {CustomError} from "../errors/CustomError.js";


const isProd = process.env.NODE_ENV === 'production';
const isDebugMode = process.env.APP_DEBUG === 'true';

export default function exceptionHandler(err, req, res, next) {

    if (res.headersSent) {
        return next(err);
    }


    if (err instanceof CustomError) {
        const message = err.expose ? err.message : "An error occurred. Please view logs for more details";

        const payload = {
            error: {
                message: message,
                code: err.code,
                details: err.details?? null,
            },
            requestId: req.requestId ?? null,
        }

        if (!isProd && isDebugMode) {
            payload.error.stack = err.stack;
        }
        return res.status(err.status).json(payload);
    }

    const payload = {
        error: {
            message: "An error occurred. Please view logs for more details",
            code: "INTERNAL_ERROR",
        },
        requestId: req.requestId ?? null,
    }

    if (!isProd && isDebugMode) {
        payload.error.stack = err.stack;
    }

    return res.status(500).json(payload);
}