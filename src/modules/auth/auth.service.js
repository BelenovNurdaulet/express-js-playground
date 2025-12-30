import jwt from "jsonwebtoken";

export function signAccessToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_ACCESS_IN || "5m"}
    );
}

export function signRefreshToken(user) {
    return jwt.sign(
        {id: user.id, type: "refresh_token"}
        , process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_REFRESH_IN || "7d"}
    )
}

export function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}