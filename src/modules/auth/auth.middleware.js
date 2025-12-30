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