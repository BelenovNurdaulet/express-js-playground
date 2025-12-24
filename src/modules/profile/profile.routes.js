import { Router } from "express";
import { me, updatePassword, updateProfile } from "./profile.controller.js";
import {auth} from "../auth/auth.middleware.js";
import {asyncHandler} from "../../shared/asyncHandler.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Профиль пользователя
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ProfileMeResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: "user@mail.com"
 *         name:
 *           type: string
 *           nullable: true
 *           example: "Nurdaulet"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-23T10:15:30.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-23T10:15:30.000Z"
 *     UpdatePasswordRequest:
 *       type: object
 *       required: [currentPassword, newPassword]
 *       properties:
 *         currentPassword:
 *           type: string
 *           example: "oldPass123"
 *         newPassword:
 *           type: string
 *           minLength: 6
 *           example: "newPass123"
 *     UpdateProfileRequest:
 *       type: object
 *       description: Нужно передать хотя бы одно поле (email или name)
 *       properties:
 *         email:
 *           type: string
 *           example: "new@mail.com"
 *         name:
 *           type: string
 *           example: "New Name"
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "OK"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Ошибка"
 */

/**
 * @swagger
 * /api/profile/me:
 *   get:
 *     tags: [Profile]
 *     summary: Получить данные текущего пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileMeResponse'
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/me", auth, asyncHandler(me));

/**
 * @swagger
 * /api/profile/updatePassword:
 *   put:
 *     tags: [Profile]
 *     summary: Обновить пароль текущего пользователя
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       200:
 *         description: Пароль обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: "Пароль обновлён"
 *       400:
 *         description: Неверные данные или неверный текущий пароль
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingFields:
 *                 value: { message: "currentPassword и newPassword обязательны" }
 *               wrongPassword:
 *                 value: { message: "Неверный пароль" }
 *               weakPassword:
 *                 value: { message: "Новый пароль должен быть минимум 6 символов" }
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/updatePassword", auth , asyncHandler(updatePassword));

/**
 * @swagger
 * /api/profile/updateProfile:
 *   patch:
 *     tags: [Profile]
 *     summary: Обновить данные профиля (email и/или name)
 *     description: Можно обновить email и/или name. Нужно передать хотя бы одно поле.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *           examples:
 *             onlyEmail:
 *               value: { email: "new@mail.com" }
 *             onlyName:
 *               value: { name: "New Name" }
 *             both:
 *               value: { email: "new@mail.com", name: "New Name" }
 *     responses:
 *       200:
 *         description: Данные обновлены
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: "Данные обновлены"
 *       400:
 *         description: Не переданы поля для обновления
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Заполните хотя бы одно поле"
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Почта уже занята (если ты это реализуешь)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Почта \"new@mail.com\" уже занята"
 */
router.patch("/updateProfile", auth, asyncHandler(updateProfile));

export default router;
