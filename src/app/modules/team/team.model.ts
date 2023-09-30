import mongoose, { Schema } from "mongoose";
import { ITeam, TeamModel } from "./team.interface";

const TeamSchema = new Schema<ITeam, TeamModel>(
    {
        teamName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50,
            unique: true,
        },
        // teamLogo: {
        //     type: String,
        //     required: true,
        // },
        teamCategory: {
            type: String,
            required: true,
            maxlength: 100,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps to the document
    },
);

const Team = mongoose.model<ITeam, TeamModel>("Team", TeamSchema);

export default Team;
