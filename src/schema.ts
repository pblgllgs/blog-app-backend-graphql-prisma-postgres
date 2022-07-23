import { gql } from "apollo-server";

export const typeDefs = gql`
    type Query {
        posts: [Post!]!
    }

    type Mutation {
        postCreate( post: PostInput!): PostPayload!
        postUpdate( postId: ID!, post: PostInput!): PostPayload
        postDelete( postId: ID!): PostPayload
        signup(email: String!, name: String!, password: String!, bio:String!): AuthPayload!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        profile: Profile!
        post: [Post!]!
    }
    type Profile {
        id: ID!
        bio: String!
        user: User!
    }

    type PostPayload {
        userErrors:[UserError!]!
        post: Post
    }

    type UserError{
        message: String!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        createdAt: String!
        published: Boolean!
        user: User!
    }

    type AuthPayload {
        userErrors:[UserError!]!
        user: User
    }

    input PostInput {
        title: String
        content: String
    }
`;