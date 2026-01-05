import {Router} from "express";
import {asyncHandler} from "../../shared/asyncHandler.js";
import {auth} from "../auth/auth.middleware.js";
import {createPost, deletePost, getAllMyPosts, getAllPosts, getPostById, updateMyPost} from "./post.controller.js";

const router = Router();

router.get('/', asyncHandler(getAllPosts));
router.get('/my' , auth , asyncHandler(getAllMyPosts));
router.get('/:id' , asyncHandler(getPostById))

router.post('/' , auth , asyncHandler(createPost));

router.delete('/:id' , auth , asyncHandler(deletePost));
router.patch('/:id' , auth , asyncHandler(updateMyPost));


/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: Посты
 *
 * components:
 *   schemas:
 *     PostListItem:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 123
 *         title:
 *           type: string
 *           example: "string"
 *         content:
 *           type: string
 *           example: "string"
 *         published:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-30T10:00:00Z"
 *
 *     PostDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 123
 *         title:
 *           type: string
 *           example: "string"
 *         content:
 *           type: string
 *           example: "string"
 *         published:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-30T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-30T10:00:00Z"
 *         authorId:
 *           type: number
 *           example: 123
 *
 *     PostsListResponse:
 *       type: object
 *       properties:
 *         posts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PostListItem'
 *         totalCount:
 *           type: number
 *           example: 123
 *         pageSize:
 *           type: number
 *           example: 10
 *         page:
 *           type: number
 *           example: 1
 *
 *     PostDetailResponse:
 *       type: object
 *       properties:
 *         post:
 *           $ref: '#/components/schemas/PostDetail'
 *
 *     CreatePostRequest:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           example: "string"
 *         content:
 *           type: string
 *           example: "string"
 *
 *     CreatePostResponse:
 *       type: object
 *       properties:
 *         post:
 *           $ref: '#/components/schemas/PostListItem'
 *
 *     UpdateMyPostRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "string"
 *         content:
 *           type: string
 *           example: "string"
 *
 *     UpdateMyPostResponse:
 *       type: object
 *       properties:
 *         updatePost:
 *           $ref: '#/components/schemas/PostDetail'
 *         message:
 *           type: string
 *           example: "Данные обновлены"
 *
 *     DeletePostResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Пост удален"
 *
 *     BadRequestResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Неверный запрос"
 *
 * paths:
 *   /api/posts/:
 *     get:
 *       tags: [Posts]
 *       summary: Получить список опубликованных постов
 *       parameters:
 *         - in: query
 *           name: query
 *           schema:
 *             type: string
 *           description: Поиск по title/content (contains, insensitive)
 *           example: "string"
 *         - in: query
 *           name: page
 *           schema:
 *             type: string
 *           description: Номер страницы (строкой)
 *           example: "1"
 *         - in: query
 *           name: pageSize
 *           schema:
 *             type: string
 *           description: Размер страницы (строкой), максимум 100
 *           example: "10"
 *         - in: query
 *           name: createDateMin
 *           schema:
 *             type: string
 *           description: Минимальная дата создания (парсится через new Date)
 *           example: "2025-12-30T10:00:00Z"
 *         - in: query
 *           name: createDateMax
 *           schema:
 *             type: string
 *           description: Максимальная дата создания (парсится через new Date)
 *           example: "2025-12-30T10:00:00Z"
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PostsListResponse'
 *         400:
 *           description: Ошибка запроса
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BadRequestResponse'
 *
 *     post:
 *       tags: [Posts]
 *       summary: Создать пост (published=false)
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreatePostRequest'
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CreatePostResponse'
 *         400:
 *           description: Ошибка запроса
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BadRequestResponse'
 *
 *   /api/posts/my:
 *     get:
 *       tags: [Posts]
 *       summary: Получить список моих постов
 *       parameters:
 *         - in: query
 *           name: query
 *           schema:
 *             type: string
 *           description: Поиск по title/content (contains, insensitive)
 *           example: "string"
 *         - in: query
 *           name: published
 *           schema:
 *             type: string
 *           description: Фильтр по published ("true" | "false")
 *           example: "true"
 *         - in: query
 *           name: page
 *           schema:
 *             type: string
 *           description: Номер страницы (строкой)
 *           example: "1"
 *         - in: query
 *           name: pageSize
 *           schema:
 *             type: string
 *           description: Размер страницы (строкой), максимум 100
 *           example: "10"
 *         - in: query
 *           name: createDateMin
 *           schema:
 *             type: string
 *           description: Минимальная дата создания (парсится через new Date)
 *           example: "2025-12-30T10:00:00Z"
 *         - in: query
 *           name: createDateMax
 *           schema:
 *             type: string
 *           description: Максимальная дата создания (парсится через new Date)
 *           example: "2025-12-30T10:00:00Z"
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PostsListResponse'
 *         400:
 *           description: Ошибка запроса
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BadRequestResponse'
 *
 *   /api/posts/{id}:
 *     get:
 *       tags: [Posts]
 *       summary: Получить пост по id
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: number
 *           example: 123
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PostDetailResponse'
 *         400:
 *           description: Ошибка запроса
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BadRequestResponse'
 *
 *     delete:
 *       tags: [Posts]
 *       summary: Удалить мой пост по id
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: number
 *           example: 123
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/DeletePostResponse'
 *         400:
 *           description: Ошибка запроса
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BadRequestResponse'
 *
 *     patch:
 *       tags: [Posts]
 *       summary: Обновить мой пост по id
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: number
 *           example: 123
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateMyPostRequest'
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UpdateMyPostResponse'
 *         400:
 *           description: Ошибка запроса
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BadRequestResponse'
 */


export default router;