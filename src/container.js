
import { prisma } from "./infrastructure/db/prisma.js";
import { PrismaPostRepository } from "./infrastructure/repositories/prismaPostRepository.js";

import {buildListPosts} from "./application/usecases/post/listPosts.js";
import {buildListMyPosts} from "./application/usecases/post/listMyPosts.js";
import {buildGetPostById} from "./application/usecases/post/getPostById.js";
import {buildCreatePost} from "./application/usecases/post/createPost.js";
import {buildDeletePostById} from "./application/usecases/post/deletePostById.js";
import {buildUpdatePostById} from "./application/usecases/post/updatePostById.js";
import {buildPostController} from "./presentation/http/controllers/postController.js";
import {buildPostRoutes} from "./presentation/http/routes/postsRoutes.js";



export function buildContainer() {
    // infrastructure

    const postRepo = new PrismaPostRepository(prisma);

    // application
    const listPostsUc = buildListPosts({ postRepo });
    const listMyPostsUc = buildListMyPosts({ postRepo });
    const getPostByIdUc = buildGetPostById({ postRepo });
    const createPostUc = buildCreatePost({ postRepo });
    const updatePostByIdUc = buildUpdatePostById({ postRepo });
    const deletePostByIdUc = buildDeletePostById({ postRepo });

    // presentation
    const postController = buildPostController({
        listPostsUc,
        listMyPostsUc,
        getPostByIdUc,
        createPostUc,
        updatePostByIdUc,
        deletePostByIdUc,
    });

    const postRoutes = buildPostRoutes({ postController });
    return {
        routes: {
            postRoutes,
        },
    };
}
