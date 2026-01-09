import {BadRequestError, ForbiddenError, NotFoundError} from "../../../errors/CustomError.js";

export function buildUpdatePostById({postRepo}) {
    return async function updatePostById({postId , userId , title , content}) {
        const id = Number(postId)

        if ((!id || isNaN(id)) || !userId) {
            throw new BadRequestError('Неверный запрос')
        }

        if (!title && !content) {
            throw new BadRequestError('Заполните хотя бы одно поле')
        }

        const post = await postRepo.findPostById({postId: id , select: {authorId: true}})
        if (!post) {
            throw new NotFoundError('Пост не найден')
        }
        if (post.authorId !== userId) {
            throw new ForbiddenError('Нет прав')
        }

        const data ={}
        if(title) data.title = title
        if(content) data.content = content


        const updatePost = await postRepo.updatePostById({postId: id , data})
        return ({message: 'Успех' , post: updatePost})

    }

}