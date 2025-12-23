import {Router} from "express";
import {register, login} from "./auth.controller.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Авторизация
 */


/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       description: User Registration Data (object)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "string@example.com"
 *               password:
 *                 type: string
 *                 example: "string"
 *               name:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login and get JWT token
 *     description: Возвращает JWT токен при успешной авторизации
 *     operationId: login
 *
 *     requestBody:
 *       description: User login Data (object)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email пользователя
 *                 example: "string@example.com"
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *                 example: "string"
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 */



export default router;