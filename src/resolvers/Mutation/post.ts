import { Post, Prisma } from '@prisma/client';
import { Context } from '../../index';
import { canUserMutatePost } from '../utils/canUserMutatePost';

interface PostArgs {
    post: {
        title?: string;
        content?: string;
    }
}

interface PostPayloadType {
    userErrors: {
        message: string;
    }[];
    post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postResolvers = {
    postCreate: async (_: any, { post }: PostArgs, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: 'You must be logged in to create a post'
                }],
                post: null
            }
        }
        const { title, content } = post;
        if (!title || !content) {
            return {
                userErrors: [{
                    message: 'Title and content are required'
                }],
                post: null
            }
        }
        return {
            userErrors: [],
            post: prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: userInfo.userId
                }
            })

        }
    },
    postUpdate: async (_: any, { post, postId }: { postId: String, post: PostArgs["post"] }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: 'You must be logged in to create a post'
                }],
                post: null
            }
        }
        const error = await canUserMutatePost({ userId: userInfo.userId, postId: Number(postId), prisma });
        if (error) {
            return error;
        };
        const { title, content } = post;
        if (!title && !content) {
            return {
                userErrors: [{
                    message: 'Need yo have al least one field to update'
                }],
                post: null
            }
        }
        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (!existingPost) {
            return {
                userErrors: [{
                    message: 'Post not found'
                }],
                post: null
            }
        }

        let payloadToUpdate = {
            title, content
        }

        if (!title) delete payloadToUpdate.title;
        if (!content) delete payloadToUpdate.content;

        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(postId)
                },
                data: {
                    ...payloadToUpdate
                }
            })
        }
    },
    postDelete: async (_: any, { postId }: { postId: String }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: 'You must be logged in to create a post'
                }],
                post: null
            }
        }
        const error = await canUserMutatePost({ userId: userInfo.userId, postId: Number(postId), prisma });
        if (error) {
            return error;
        };
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (!post) {
            return {
                userErrors: [{
                    message: 'Post not found'
                }],
                post: null
            }
        }
        await prisma.post.delete({
            where: {
                id: Number(postId)
            }
        })
        return {
            userErrors: [],
            post
        }
    },
    postPublish: async (_: any, { postId }: { postId: String }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: 'You must be logged in to create a post'
                }],
                post: null
            }
        }
        const error = await canUserMutatePost({ userId: userInfo.userId, postId: Number(postId), prisma });
        if (error) {
            return error;
        };
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (!post) {
            return {
                userErrors: [{
                    message: 'Post not found'
                }],
                post: null
            }
        }
        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(postId)
                },
                data: {
                    published: true
                }
            })
        }
    },
    postUnpublish: async (_: any, { postId }: { postId: String }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: 'You must be logged in to create a post'
                }],
                post: null
            }
        }
        const error = await canUserMutatePost({ userId: userInfo.userId, postId: Number(postId), prisma });
        if (error) {
            return error;
        };
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (!post) {
            return {
                userErrors: [{
                    message: 'Post not found'
                }],
                post: null
            }
        }
        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(postId)
                },
                data: {
                    published: false
                }
            })
        }
    },
    changePublishState: async (_: any, { postId }: { postId: String }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: 'You must be logged in to create a post'
                }],
                post: null
            }
        }
        const error = await canUserMutatePost({ userId: userInfo.userId, postId: Number(postId), prisma });
        if (error) {
            return error;
        };
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });
        if (!post) {
            return {
                userErrors: [{
                    message: 'Post not found'
                }],
                post: null
            }
        }
        return {
            userErrors: [],
            post:  prisma.post.update({
                where: {
                    id: Number(postId)
                },
                data: {
                    published: !post.published
                }
            })
        }
    },
}