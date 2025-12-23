import jwt from "jsonwebtoken";

export function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({error: 'Unauthorized'});

    const token = header.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id: payload.sub};
        return next()
    } catch (e) {
        return res.status(401).json({ error: "Unauthorized" });
    }

}