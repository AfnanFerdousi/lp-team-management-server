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
        teamCategory: {
            type: String,
            required: true,
            maxlength: 100,
        },
        status: {
            type: String,
            enum: ["active", "pending", "rejected"],
            default: "pending",
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps to the document
    },
);

const Team = mongoose.model<ITeam, TeamModel>("Team", TeamSchema);

export default Team;
