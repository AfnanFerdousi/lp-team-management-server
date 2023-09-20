import mongoose, {  Model } from "mongoose";

export interface IUser  {
    username: string;
    email: string;
    password: string;
    role: "admin" | "user";
    teams: Array<{
        [x: string]: any;
        teamName: string;
        teamCategory: string;
        status: "active" | "pending" | "rejected";
    }>;
    notifications: Array<{
        type: "invitation";
        teamName: string;
        sentBy: mongoose.Types.ObjectId | IUser;
        status: "accepted" | "rejected" | "pending";
    }>;
    needsPasswordChange: boolean;
    passwordChangedAt?: Date;
}

export type UserModel = {
    userExists(
        email: string,
    ): Promise<Pick<IUser, "email" | "password" | "role" | "needsPasswordChange">>;
    comparePassword(
        givenPassword: string,
        savedPassword: string,
    ): Promise<boolean>;
} & Model<IUser>;
