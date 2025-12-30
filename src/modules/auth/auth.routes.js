import {Router} from "express";
import {register, login, refreshToken, logout} from "./auth.controller.js";
import {asyncHandler} from "../../shared/asyncHandler.js";

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/refresh', asyncHandler(refreshToken));
router.post('/logout', asyncHandler(logout));

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Аутентификация и токены
 *
 * components:
 *   schemas:
 *     AuthRegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: "string"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@gmail.com"
 *         password:
 *           type: string
 *           example: "Str1ng!Pass"
 *
 *     AuthLoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@gmail.com"
 *         password:
 *           type: string
 *           example: "Str1ng!Pass"
 *
 *     AuthUser:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - name
 *         - createdAt
 *       properties:
 *         id:
 *           type: string
 *           example: "string"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@gmail.com"
 *         name:
 *           type: string
 *           nullable: true
 *           example: "string"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-30T10:00:00Z"
 *
 *     AuthRegisterResponse:
 *       type: object
 *       required:
 *         - user
 *       properties:
 *         user:
 *           $ref: "#/components/schemas/AuthUser"
 *
 *     AuthLoginResponse:
 *       type: object
 *       required:
 *         - user
 *         - accessToken
 *       properties:
 *         user:
 *           $ref: "#/components/schemas/AuthUser"
 *         accessToken:
 *           type: string
 *           example: "string"
 *
 *     AuthSuccessResponse:
 *       type: object
 *       required:
 *         - success
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *     ErrorResponse:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           example: "Заполните все необходимые поля"
 *
 * paths:
 *   /api/auth/register:
 *     post:
 *       tags:
 *         - Auth
 *       summary: Регистрация пользователя
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthRegisterRequest"
 *             example:
 *               email: "user@gmail.com"
 *               password: "Str1ng!Pass"
 *               name: "string"
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/AuthRegisterResponse"
 *               example:
 *                 user:
 *                   id: "string"
 *                   email: "user@gmail.com"
 *                   name: "string"
 *                   createdAt: "2025-12-30T10:00:00Z"
 *         "400":
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/ErrorResponse"
 *
 *   /api/auth/login:
 *     post:
 *       tags:
 *         - Auth
 *       summary: Логин (выдаёт access token и ставит cookie)
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthLoginRequest"
 *             example:
 *               email: "user@gmail.com"
 *               password: "Str1ng!Pass"
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/AuthLoginResponse"
 *               example:
 *                 user:
 *                   id: "string"
 *                   email: "user@gmail.com"
 *                   name: "string"
 *                   createdAt: "2025-12-30T10:00:00Z"
 *                 accessToken: "string"
 *         "400":
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/ErrorResponse"
 *
 *   /api/auth/refresh:
 *     post:
 *       tags:
 *         - Auth
 *       summary: Обновление токенов по refresh_token cookie
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/AuthSuccessResponse"
 *               example:
 *                 success: true
 *         "400":
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/ErrorResponse"
 *
 *   /api/auth/logout:
 *     post:
 *       tags:
 *         - Auth
 *       summary: Выход (очистка access_token и refresh_token cookie)
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/AuthSuccessResponse"
 *               example:
 *                 success: true
 *         "400":
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/ErrorResponse"
 */


export default router;