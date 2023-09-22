import { IUser } from "../user/user.interface";

export type ILoginUser = {
    email: string;
    password: string;
};

export type ILoginUserResponse = {
    user: {
        email: string;
        role: 'user' | 'admin';
        needsPasswordChange: boolean;
    };
    accessToken: string;
    refreshToken?: string;
};

export type IRefreshTokenResponse = {
    accessToken: string;
};

export type IVerifiedLoginUser = {
    email: string;
    role: 'user' | 'admin';
};

export type IChangePassword = {
    oldPassword: string;
    newPassword: string;
};