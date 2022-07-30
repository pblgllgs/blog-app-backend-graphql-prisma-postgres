import { ApolloServer } from "apollo-server";
import { typeDefs } from './schema';
import { Query, Mutation, Profile, User, Post } from './resolvers';
import { Prisma, PrismaClient } from "@prisma/client";
import { getUserFromToken } from './resolvers/utils/getUserFromToken';
import { config } from "./config/config";

export const prisma = new PrismaClient();

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
    userInfo: {
        userId: number;
    } | null;
}

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        Profile,
        User,
        Post
    },
    context: async ({ req }: any): Promise<Context> => {
        const userInfo = await getUserFromToken(req.headers.authorization);
        return {
            prisma,
            userInfo
        }
    }
});

server.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`);
})