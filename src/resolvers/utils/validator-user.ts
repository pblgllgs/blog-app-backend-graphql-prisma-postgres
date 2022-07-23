import validator from 'validator';

interface UserPayload {
    userErrors: {
        message: string;
    }[];
    user: null;
}

export const validatorUser = (email: string, name: string, password: string, bio: string): UserPayload | undefined => {
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
}