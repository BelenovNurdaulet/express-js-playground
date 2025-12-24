import crypto from "crypto";

export default function requestId(req, res, next) {
    const requestId = crypto.randomUUID()

    req.requestId = requestId
    res.setHeader('X-Request-Id', requestId);

    next()
}