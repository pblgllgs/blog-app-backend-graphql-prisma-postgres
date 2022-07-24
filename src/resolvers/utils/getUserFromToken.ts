import JWT from 'jsonwebtoken';

export const getUserFromToken = async (token: string) => {
    try {
        return JWT.verify(token, process.env.JWT_SECRET!) as {
            userId: number;
        };
    } catch (error) {
        return null;
    }
}