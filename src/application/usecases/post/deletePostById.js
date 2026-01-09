import {BadRequestError, ForbiddenError, NotFoundError} from "../../../errors/CustomError.js";

export function buildDeletePostById({postRepo}) {
    return async function deletePostById({postId, userId}) {
        const id = Number(postId)
        if ((!id || isNaN(id)) || !userId) {
            throw new BadRequestError('Неверный запрос')
        }
        const post = await postRepo.findPostById({postId: id , select: {authorId: true}})
        if (!post) {
            throw new NotFoundError('Пост не найден')
        }
        if (post.authorId !== userId) {
            throw new ForbiddenError('Нет прав')
        }
        await postRepo.deletePostById({postId: id})
        return ({message: 'Пост удален'})
    }

}