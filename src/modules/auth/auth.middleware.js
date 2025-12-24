import jwt from "jsonwebtoken";
import {UnauthorizedError} from "../../errors/CustomError.js";

export function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
         throw new UnauthorizedError("Unauthorized");
    }

    const token = header.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id: payload.sub};
        return next()
    } catch (e) {
       throw new UnauthorizedError("Unauthorized");
    }
}