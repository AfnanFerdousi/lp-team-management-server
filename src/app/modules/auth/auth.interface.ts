export type ILoginUser = {
    email: string;
    password: string;
};

export type ILoginUserResponse = {
    accessToken: string;
    refreshToken?: string;
    needsPasswordChange: boolean;
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