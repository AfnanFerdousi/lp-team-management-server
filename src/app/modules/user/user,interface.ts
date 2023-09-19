import mongoose, {  Model } from "mongoose";

export interface IUser  {
    id: string;
    username: string;
    email: string;
    password: string;
    role: "admin" | "user";
    teams: Array<{
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
        id: string,
    ): Promise<Pick<IUser, "id" | "password" | "role" | "needsPasswordChange">>;
    comparePassword(
        givenPassword: string,
        savedPassword: string,
    ): Promise<boolean>;
} & Model<IUser>;
