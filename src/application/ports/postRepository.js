import {NotImplementedError} from "../../errors/CustomError.js";

export class PostRepository {
    async findManyPosts(_params) {throw new NotImplementedError('Нет реализации');}
    async countManyPosts(_params) {throw new NotImplementedError('Нет реализации');}
    async findPostById(_params) {throw new NotImplementedError('Нет реализации');}
    async createPost(_params){throw new NotImplementedError('Нет реализации');}
    async updatePostById(_params) {throw new NotImplementedError('Нет реализации');}
    async deletePostById(_params) {throw new NotImplementedError('Нет реализации');}
}