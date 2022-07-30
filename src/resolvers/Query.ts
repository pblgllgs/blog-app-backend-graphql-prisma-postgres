import { Context } from '../index';

export const Query = {
    posts: async (_: any, __: any, { prisma }: Context) => {
        const posts = await prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: [
                {
                    createdAt: "desc"
                }
            ]
        });
        return posts;
    },
    me: async (_: any, __: any, { prisma, userInfo }: Context) => {
        if (!userInfo) {
            return null;
        }
        const user = await prisma.user.findUnique({
            where: {
                id: userInfo.userId
            }
        });
        return user;
    },
    profile: (_: any, { userId }: { userId: string }, { prisma, userInfo }: Context) => {
        const isMyProfile = Number(userId) === userInfo?.userId;
        const profile = prisma.profile.findUnique({
            where: {
                userId: Number(userId)
            }
        });
        if(!profile) {
            return null;
        }
        return {
            ...profile,
            isMyProfile
        }
    },
    users: async (_: any, __: any, { prisma }: Context) => {
        const users = await prisma.user.findMany({
            orderBy: [
                {
                    createdAt: "desc"
                }
            ]
        });
        return users;
    }
}