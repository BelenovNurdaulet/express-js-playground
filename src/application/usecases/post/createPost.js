import {BadRequestError} from "../../../errors/CustomError.js";

export function buildCreatePost({postRepo}) {
    return async function createPost({title, content, userId}) {

        if (!title || !content || !userId) {
            throw new BadRequestError("Неверный запрос");
        }
        const data = {title, content, authorId: userId};
        const post = await postRepo.createPost({data});
        return {message: 'Успех', post};
    }
}