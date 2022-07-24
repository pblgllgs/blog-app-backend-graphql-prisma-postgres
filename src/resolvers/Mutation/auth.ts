import { Context } from '../../index';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

interface SignupArgs {
    credentials:{
        email: string;
        password: string;
    },
    name: string;
    bio: string;
}

interface SigninArgs {
    credentials: {
        email: string;
        password: string;
    }
}

interface UserPayload {
    userErrors: {
        message: string;
    }[];
    token: String | null;
}

export const authResolvers = {
    signup: async (_: any, {credentials, name, bio }: SignupArgs, { prisma }: Context): Promise<UserPayload> => {
        const { email, password } = credentials;
        const isEmail = validator.isEmail(email);
        if (!isEmail) {
            return {
                userErrors: [{
                    message: 'Email is invalid'
                }],
                token: null
            }
        }
        const isValidPassword = validator.isLength(password, { min: 6 });
        if (!isValidPassword) {
            return {
                userErrors: [{
                    message: 'Password is invalid, password must be at least 6 characters'
                }],
                token: null
            }
        }
        const isValidName = validator.isLength(name, { min: 2 });
        if (!isValidName) {
            return {
                userErrors: [{
                    message: 'Name is invalid, name must be at least 2 characters'
                }],
                token: null
            }
        }
        if (!name || !bio) {
            return {
                userErrors: [{
                    message: 'Name and bio are invalid'
                }],
                token: null
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        });

        await prisma.profile.create({
            data: {
                bio,
                userId: user.id
            }
        })

        const token = await JWT.sign({
            userId: user.id,
            email: user.email,
        },
            process.env.JWT_SECRET!,
            {
                expiresIn: 3600000
            }
        );
        return {
            userErrors: [],
            token
        }
    },
    signin: async (_: any, { credentials }: SigninArgs, { prisma }: Context): Promise<UserPayload> => {
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        }); 
        if (!user) {
            return {
                userErrors: [{
                    message: 'credentials are invalid'
                }],
                token: null
            }
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return {
                userErrors: [{
                    message: 'credentials are invalid'
                }],
                token: null
            }
        }
        const token = await JWT.sign({
            userId: user.id,
            email: user.email,
        },
            process.env.JWT_SECRET!,
            {
                expiresIn: 3600000
            }
        );
        return {
            userErrors: [],
            token
        }
    }
}