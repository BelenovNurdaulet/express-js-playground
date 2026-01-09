import {BadRequestError, ForbiddenError, NotFoundError} from "../../../errors/CustomError.js";

export function buildGetPostById({postRepo}) {
    return async function getPostById({postId, userId}) {
        const id = Number(postId)

        if (!id || isNaN(id)) {
            throw new BadRequestError("Неверный запрос");
        }

        const post = await postRepo.findPostById({postId: id});

        if (!post) {
            throw new NotFoundError('Пост не найден')
        }
        if (post.published === false && (!userId || post.authorId !== userId)) {
            throw new ForbiddenError('Нет доступа')
        }
        return post;
    }
}