export function buildListPosts({postRepo}) {
    return async function listPosts({query, page = '1', pageSize = '10', createDateMin, createDateMax}) {
        const p = Math.max(parseInt(page, 10) || 1, 1)
        const ps = Math.min(Math.max(parseInt(pageSize, 10) || 10, 1), 100)

        const createdAt = {}
        if (createDateMin) {
            createdAt.gte = new Date(createDateMin);
        }
        if (createDateMax) {
            createdAt.lte = new Date(createDateMax);
        }

        const where = {
            ...((createdAt.gte || createdAt.lte) ? {createdAt} : {}),
            ...(query ? {
                OR: [
                    {title: {contains: query, mode: 'insensitive'}},
                    {content: {contains: query, mode: 'insensitive'}}
                ]
            } : {}),
            published: true,
        }

        const [posts, totalCount] = await Promise.all([
            postRepo.findManyPosts({where, pageSize: ps, page: p}),
            postRepo.countManyPosts({where}),
        ])

        return ({posts, totalCount, pageSize: ps, page: p})
    }
}