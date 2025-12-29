import jwt from "jsonwebtoken";
import {prisma} from "../../db/prisma.js";
import bcrypt from "bcrypt";

function signToken(userId) {
    return jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN || "7d"}
    );
}

export async function register(req, res) {
    const {name, email, password} = req.body;

    if (!email || !password) {
        return res.status(400).send({error: 'Заполните все необходимые поля'});
    }

    const emailExists = await prisma.user.findUnique({where: {email}});

    if (emailExists) {
        return res.status(409).send({error: `Пользователь с почтой "${email}" , уже существует`})
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {email: email, name: name ?? null, password: hashPassword},
        select: {id: true, email: true, name: true, createdAt: true}
    })

    const token = signToken(user);
    return res.status(201).json({user, token});

}

export async function login(req, res) {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).send({error: 'Заполните все необходимые поля'});
    }

    const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
        return res.status(401).send({error: 'Неверные данные авторизации'});
    }

    const passwordRight = await bcrypt.compare(password, user.password);
    if (!passwordRight) {
        return res.status(401).send({error: 'Неверные данные авторизации'});
    }

    const token = signToken(user);
    return res.status(200).json({
        user: {id: user.id, name: user.name, email: user.email},
        token,
    });
}