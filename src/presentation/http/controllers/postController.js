export function buildPostController({
                                        listPostsUc,
                                        listMyPostsUc,
                                        getPostByIdUc,
                                        createPostUc,
                                        updatePostByIdUc,
                                        deletePostByIdUc,
                                    }) {
    return {
        listPosts: async (req, res) => {
            const result = await listPostsUc({
                query: req.query.query,
                page: req.query.page,
                pageSize: req.query.pageSize,
                createDateMin: req.query.createDateMin,
                createDateMax: req.query.createDateMax,
            })
            return res.status(200).json(result)
        },


        listMyPosts: async (req, res) => {
            const result = await listMyPostsUc({
                query: req.query.query,
                page: req.query.page,
                pageSize: req.query.pageSize,
                createDateMin: req.query.createDateMin,
                createDateMax: req.query.createDateMax,
                published:   req.query.published === undefined ? undefined : req.query.published === "true",
                userId: req.user.id
            })
            return res.status(200).json(result)
        },

        getPostById: async (req, res) => {
            const result = await getPostByIdUc({
                postId: req.params.id,
                userId: req.user?.id,
            })
            return res.status(200).json(result)
        },
        updatePostById: async (req, res) => {
            const result = await updatePostByIdUc({
                postId: req.params.id,
                userId: req.user.id,
                title: req.body.title,
                content: req.body.content,
            })
            return res.status(200).json(result)

        },
        deletePostById: async (req, res) => {
            const result = await deletePostByIdUc({
                postId: req.params.id,
                userId: req.user.id,
            })
            return res.status(200).json(result)
        },

        createPost: async (req, res) => {
            const result = await createPostUc({
                userId: req.user.id,
                title: req.body.title,
                content: req.body.content,
            })
            return res.status(200).json(result)
        }
    }


}
