import { Post, Prisma } from '@prisma/client';
import { Context } from '../../index';

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
    postCreate: async (_: any, { post }: PostArgs, { prisma }: Context): Promise<PostPayloadType> => {
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
                    authorId: 1
                }
            })

        }
    },
    postUpdate: async (_: any, { post, postId }: { postId: String, post: PostArgs["post"] }, { prisma }: Context): Promise<PostPayloadType> => {
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
    postDelete: async (_: any, { postId }: { postId: String }, { prisma }: Context): Promise<PostPayloadType> => {
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
    }
}