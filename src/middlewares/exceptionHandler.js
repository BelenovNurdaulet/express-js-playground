import {CustomError} from "../errors/CustomError.js";
import logger from "../shared/logger.js";


const isProd = process.env.NODE_ENV === 'production';
const isDebugMode = process.env.APP_DEBUG === 'true';

function exceptionLevel(status) {
    if(status >= 500) return 'error';
    if(status >= 400) return 'warn';
    return 'info';
}

export default function exceptionHandler(err, req, res, next) {

    if (res.headersSent) {
        return next(err);
    }

    const status = err instanceof CustomError ? err.status : 500;

    logger[exceptionLevel(status)]({
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        status,
        code: err.code ?? "INTERNAL_ERROR",
        errName: err.name,
        errMessage: err.message,
        ...(status >= 500 ? { stack: err.stack } : {}),
        ...(req.user?.id ? { userId: req.user.id } : {}),
    }, "request failed");

    if (err instanceof CustomError) {
        const message = err.expose ? err.message : "Internal server error";

        const payload = {
            error: {
                message: message,
                code: err.code ?? 'APP_ERROR',
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
            message: "Internal server error",
            code: "INTERNAL_ERROR",
        },
        requestId: req.requestId ?? null,
    }

    if (!isProd && isDebugMode) {
        payload.error.stack = err.stack;
    }

    return res.status(500).json(payload);
}