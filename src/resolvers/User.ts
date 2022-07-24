import { Context } from '../index';


interface UserParentType {
    id: number;
}

export const User = {
    posts: async (parent: UserParentType, __: any, { prisma, userInfo }: Context) => {
        const isOwnProfile = parent.id === userInfo?.userId;
        if (!isOwnProfile) {
            const posts = await prisma.post.findMany({
                where: {
                    authorId: parent.id,
                    published: true
                },
                orderBy: [
                    {
                        createdAt: "desc"
                    }
                ]
            });
            return posts;
        }
        const posts = await prisma.post.findMany({
            where: {
                authorId: parent.id
            },
            orderBy: [
                {
                    createdAt: "desc"
                }
            ]
        });
        return posts;

    }
}