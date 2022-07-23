import { Context } from '../../index';
import validator from 'validator';
import bcrypt from 'bcryptjs';

interface SignupArgs {
    email: string;
    name: string;
    bio: string;
    password: string;
}

interface UserPayload {
    userErrors: {
        message: string;
    }[];
    user: null;
}

export const authResolvers = {
    signup: async (_: any, { email, name, password, bio }: SignupArgs, { prisma }: Context): Promise<UserPayload> => {
        const isEmail = validator.isEmail(email);
        if (!isEmail) {
            return {
                userErrors: [{
                    message: 'Email is invalid'
                }],
                user: null
            }
        }
        const isValidPassword = validator.isLength(password, { min: 6 });
        if (!isValidPassword) {
            return {
                userErrors: [{
                    message: 'Password is invalid, password must be at least 6 characters'
                }],
                user: null
            }
        }
        const isValidName = validator.isLength(name, { min: 2 });
        if (!isValidName) {
            return {
                userErrors: [{
                    message: 'Name is invalid, name must be at least 2 characters'
                }],
                user: null
            }
        }
        if (!name || !bio) {
            return {
                userErrors: [{
                    message: 'Name and bio are invalid'
                }],
                user: null
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        })
        return {
            userErrors: [],
            user: null
        }

        // return prisma.user.create({
        //     data: {
        //         email, name, password
        //     }
        // })
    }
}