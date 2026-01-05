import {BadRequestError, ForbiddenError, NotFoundError} from "../../errors/CustomError.js";
import {prisma} from "../../db/prisma.js";


export async function getAllPosts(req, res) {
    const {query, page = "1", pageSize = "10", createDateMin, createDateMax} = req.query;


    const p = Math.max(parseInt(page, 10) || 1, 1)
    const ps = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 100)
    const skip = (p - 1) * ps

    const createdAt = {};
    if (createDateMin) createdAt.gte = new Date(createDateMin);
    if (createDateMax) createdAt.lte = new Date(createDateMax);

    const where = {
        ...((createdAt.gte || createdAt.lte) ? {createdAt} : {}),

        ...(query ? {
                OR: [
                    {title: {contains: query, mode: "insensitive"}},
                    {content: {contains: query, mode: "insensitive"}}
                ],
            } : {}
        )
    }

    const [posts, totalCount] = await Promise.all([
        prisma.post.findMany({
            where: {...where, published: true},
            skip: skip,
            take: ps,
            orderBy: {createdAt: "desc"},
            select: {id: true, title: true, content: true, published: true, createdAt: true},
        }),
        prisma.post.count({where: {...where, published: true}})])

    res.status(200).json({posts, totalCount, pageSize: ps, page: p})
}

export async function getAllMyPosts(req, res) {
    const {query, published, page = "1", pageSize = "10", createDateMin, createDateMax} = req.query;

    const p = Math.max(parseInt(page, 10) || 1, 1)
    const ps = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 100)
    const skip = (p - 1) * ps

    const createdAt = {};
    if (createDateMin) createdAt.gte = new Date(createDateMin);
    if (createDateMax) createdAt.lte = new Date(createDateMax);

    const where = {
        ...((createdAt.gte || createdAt.lte) ? {createdAt} : {}),
        authorId: req.user.id,
        ...(query ? {
                OR: [
                    {title: {contains: query, mode: "insensitive"}},
                    {content: {contains: query, mode: "insensitive"}}
                ],
            } : {}
        ),
        ...(published !== undefined ? {published: published === "true"} : {}),
    }

    const [posts, totalCount] = await Promise.all([
        prisma.post.findMany({
            where: where,
            skip: skip,
            take: ps,
            orderBy: {createdAt: "desc"},
            select: {id: true, title: true, content: true, published: true, createdAt: true},
        }),
        prisma.post.count({where})])

    res.status(200).json({posts, totalCount, pageSize: ps, page: p})

}

export async function updateMyPost(req, res) {
    const {title, content} = req.body;

    const postId = Number(req.params.id);

    if (!postId || isNaN(postId)) {
        throw new BadRequestError("Неверный запрос");
    }

    if (!title && !content) {
        throw new BadRequestError("Измените хотя бы одно поле")
    }

    const data = {}
    if (title) data.title = title;
    if (content) data.content = content;

    const post = await prisma.post.findUnique(
        {
            where: {id: postId},
            select: {authorId: true},
        });
    if (!post) {
        throw new NotFoundError('Пост не найден')
    }

    if (!req.user || post.authorId !== req.user.id) {
        throw new ForbiddenError('Нет доступа')
    }

    const updatePost = await prisma.post.update({
        where: {id: postId},
        data,
        select: {
            id: true,
            title: true,
            content: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            authorId: true
        },
    })

    res.status(200).json({updatePost, message: 'Данные обновлены'})


}

export async function getPostById(req, res) {
    const postId = Number(req.params.id);

    if (!postId || isNaN(Number(postId))) {
        throw new BadRequestError("Неверный запрос");
    }

    const post = await prisma.post.findUnique(
        {
            where: {id: postId},
            select: {
                id: true,
                title: true,
                content: true,
                published: true,
                createdAt: true,
                updatedAt: true,
                authorId: true
            },
        });

    if (!post) {
        throw new NotFoundError("Пост не найден");
    }

    if (post.published === false && (!req.user || post.authorId !== req.user.id)) {
        throw new ForbiddenError('Нет доступа');
    }

    res.status(200).json({post})

}

export async function createPost(req, res) {
    const {title, content} = req.body;

    if (!title || !content) {
        throw new BadRequestError("Invalid request");
    }

    const post = await prisma.post.create({
            data: {title: title, content: content, published: false, authorId: req.user.id},
            select: {id: true, title: true, content: true, published: true, createdAt: true},
        }
    )

    return res.status(200).json({post});
}

export async function deletePost(req, res) {
    const postId = Number(req.params.id);

    if (!postId || Number.isNaN(postId)) {
        throw new BadRequestError("Invalid id");
    }
    const post = await prisma.post.findUnique(
        {
            where: {id: postId},
            select: {id: true, title: true, content: true, published: true, createdAt: true, authorId: true},
        }
    )
    if (!post || post.authorId !== req.user.id) {
        throw new NotFoundError('Пост не найден')
    }

    await prisma.post.delete({
        where: {id: postId},
    })

    return res.status(200).json({message: "Пост удален"});

}

