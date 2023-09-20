import mongoose, { Model, Types } from "mongoose";
import { IUser } from "../user/user.interface";

export interface ITeam {
    teamName: string;
    teamCategory: string;
    status: "active" | "pending" | "rejected";
    admin: Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}

export type TeamModel = Model<ITeam>;
