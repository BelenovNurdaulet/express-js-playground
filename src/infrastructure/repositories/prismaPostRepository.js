import {PostRepository} from "../../application/ports/postRepository.js";

export class PrismaPostRepository extends PostRepository{
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }

    async findManyPosts({where, page, pageSize}) {
        return this.prisma.post.findMany({
            where: {...where},
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {createdAt: 'desc'},
            select: {id: true, title: true, content: true, published: true, createdAt: true},
        })
    }

    async countManyPosts({where}) {
        return this.prisma.post.count({where: {...where}})
    }

    async findPostById({postId , select}) {
        return this.prisma.post.findUnique(
            {
                where: {id: postId},
                select: select ? {...select} : {
                    id: true,
                    title: true,
                    content: true,
                    published: true,
                    createdAt: true,
                    updatedAt: true,
                    authorId: true
                } ,
            }
        )
    }

    async createPost({data}) {
        return this.prisma.post.create({
            data: data,
            select: {id: true, title: true, content: true, published: true, createdAt: true},
        })
    }

    async updatePostById({postId, data}) {
        return this.prisma.post.update({
            where: {id: postId},
            data: data,
            select: {id: true, title: true, content: true, published: true, createdAt: true},
        })
    }

    async deletePostById({postId}) {
        return this.prisma.post.delete({
            where: {id: postId},
        })
    }
}
