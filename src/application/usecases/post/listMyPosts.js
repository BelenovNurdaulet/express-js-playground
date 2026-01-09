export function buildListMyPosts({postRepo}) {
    return async function listMyPosts({query, page = '1', pageSize = '10', createDateMin, createDateMax, published, userId}) {
        const p = Math.max(parseInt(page, 10) || 1, 1)
        const ps = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 100)

        const createdAt = {}
        if (createDateMin) {createdAt.gte = new Date(createDateMin)}
        if (createDateMax) {createdAt.lte = new Date(createDateMax)}

        const where = {
            ...((createdAt.gte || createdAt.lte) ? {createdAt} : {}),
            ...(query ? {
                    OR: [{title: {contains: query, mode: 'insensitive'}},
                        {content: {contains: query, mode: 'insensitive'}}]
                } : {}
            ),
            ...(published !== undefined ? {published: published === "true"} : {}),
            authorId: userId,
        }

        const [posts, totalCount] = await Promise.all([
            postRepo.findManyPosts({where, page: p, pageSize: ps}),
            postRepo.countManyPosts({where})
        ])

        return ({posts, totalCount, pageSize: ps, page: p})
    }
}