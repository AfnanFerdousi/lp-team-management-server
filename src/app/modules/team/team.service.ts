import { ITeam } from "./team.interface";
import Team from "./team.model";
import User from "../user/user.model"; // Import the User model
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const createTeam = async (
    team: ITeam
): Promise<ITeam | null> => {
    // Check if a team with the same name already exists
    const existingTeam = await Team.findOne({ teamName: team.teamName });

    if (existingTeam) {
        // A team with the same team name already exists, handle this error
        throw new ApiError(httpStatus.BAD_REQUEST, "Team name already in use");
    }

    const newTeam = await Team.create(team);
    return newTeam;
};


const getTeams = async (): Promise<ITeam[]> => {
    const teams = await Team.find();
    return teams;
}

const updateTeam = async (
    id: string,
    team: ITeam
) => {
    // Check if a team with the same name already exists
    const existingTeam = await Team.findOne({ _id: id });

    if (!existingTeam) {
        // A team with the same team name already exists, handle this error
        throw new ApiError(httpStatus.BAD_REQUEST,"Team doesn't exist");
    }
    if (team.teamName) {
        const exists = await Team.findOne({ teamName: team.teamName });
        if (exists) {
            throw new ApiError(httpStatus.BAD_REQUEST,"Team name already in use");
        }
    }

    const updatedTeam = await Team.findByIdAndUpdate(team.teamName, team, {
        new: true,
    });
    return updatedTeam;
}

export default {
    createTeam,
    getTeams,
    updateTeam
};
