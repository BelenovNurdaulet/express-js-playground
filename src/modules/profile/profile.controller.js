import {prisma} from "../../db/prisma.js";
import bcrypt from "bcrypt";

export async function me(req, res) {
    const user = await prisma.user.findUnique({
        where: {id: req.user.id},
        select: {id: true, email: true, name: true, createdAt: true, updatedAt: true},
    })
    if (!user) return res.status(404).json({message: "Пользователь не найден"});

    return res.json(user);
}

export async function updatePassword(req, res) {
    const {currentPassword, newPassword} = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({message: "currentPassword и newPassword обязательны"});
    }

    const user = await prisma.user.findUnique({
        where: {id: req.user.id},
        select: {id: true, password: true},
    })
    if (!user) return res.status(404).json({message: "Пользователь не найден"});


    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
        return res.status(400).json({message: "Неверный пароль"})
    }

    if (newPassword.length < 6) {
        return res.status(400).json({message: "Новый пароль должен быть минимум 6 символов"});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: {id: req.user.id},
        data: {password: hashedPassword},
    });


    return res.json({message: "Пароль обновлён"});
}

export async function updateProfile(req, res) {
    const {email, name} = req.body;

    if (!email && !name) {
        return res.status(400).json({message: "Заполните хотя бы одно поле"})
    }


    const data = {};
    if (email) {
        const emailExists = await prisma.user.findUnique({where: {email}});

        if (emailExists && (emailExists.id !== req.user.id)) {
            return res.status(409).json({message: `Почта "${email}" уже занята`});
        }
        data.email = email;
    }

    if (name) data.name = name;

    await prisma.user.update({
        where: {id: req.user.id},
        data,
    });

    return res.json({message: "Данные обновлены"});

}

