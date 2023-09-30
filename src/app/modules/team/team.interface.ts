import  { Model } from "mongoose";

export interface ITeam {
    teamName: string;
    teamCategory: string;
    // teamLogo: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export type TeamModel = Model<ITeam>;
