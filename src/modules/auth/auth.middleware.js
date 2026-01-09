import {UnauthorizedError} from "../../errors/CustomError.js";
import {verifyToken} from "./auth.service.js";

export function auth(req, res, next) {
    const token = req.cookies?.access_token;

    if (!token) {
        throw new UnauthorizedError("Authentication required");
    }
    try {
        const payload = verifyToken(token)
        req.user = {
            id: payload.id,
            email: payload.email,
            name: payload.name,
        };
        return next()
    } catch {
        throw new UnauthorizedError("Invalid or expired token");
    }
}

export function optionalAuth(req, res, next) {
    const token = req.cookies?.access_token;
    if (token) {
        try {
            const payload = verifyToken(token)
            req.user = {
                id: payload.id,
                email: payload.email,
                name: payload.name,
            };
        } catch {
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
        }
    }
    return next()
}