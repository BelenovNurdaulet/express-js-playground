import {prisma} from "../../infrastructure/db/prisma.js";
import bcrypt from "bcrypt";
import {signAccessToken, signRefreshToken, verifyToken} from "./auth.service.js";
import {BadRequestError, ConflictError, UnauthorizedError} from "../../errors/CustomError.js";

export async function register(req, res) {
    const {name, email, password} = req.body;
    if (!email || !password) {
      throw new BadRequestError("Заполните все необходимые поля");
    }

    const emailExists = await prisma.user.findUnique({where: {email}});
    if (emailExists) {
        throw new ConflictError(`Пользователь с почтой "${email}" , уже существует`)
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {email: email, name: name ?? null, password: hashPassword},
        select: {id: true, email: true, name: true, createdAt: true}
    })

    return res.status(200).json({user});

}

export async function login(req, res) {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new BadRequestError("Заполните все необходимые поля");
    }

    const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
        throw new UnauthorizedError(`Неверные данные авторизации`)
    }

    const passwordRight = await bcrypt.compare(password, user.password);
    if (!passwordRight) {
        throw new UnauthorizedError(`Неверные данные авторизации`)
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie('access_token', accessToken, {httpOnly: true});
    res.cookie('refresh_token', refreshToken, {httpOnly: true});

    return res.status(200).json({
        user: {id: user.id, name: user.name, email: user.email, createdAt: user.createdAt},
        accessToken: accessToken,
    });
}

export async function refreshToken(req, res) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
        throw new UnauthorizedError("Tokens is required");
    }

    const payload = verifyToken(refreshToken);

    if (!payload || payload.type !== "refresh_token") {
        throw new UnauthorizedError("Unauthorized");
    }

    const user = await prisma.user.findUnique({where: {id: payload.id}});

    if (!user) {
        throw new UnauthorizedError("Unauthorized");
    }
    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);

    res.cookie('access_token', newAccessToken, {httpOnly: true});
    res.cookie('refresh_token', newRefreshToken, {httpOnly: true});

    return res.status(200).json({'success': true});
}

export async function logout(req, res) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return res.status(200).json({'success': true});
}



