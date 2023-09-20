import { ITeam } from "./team.interface";
import Team from "./team.model";
import User from "../user/user.model"; // Import the User model
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IUser } from "../user/user.interface";
import { JwtPayload } from "jsonwebtoken";

const createTeam = async (team: ITeam): Promise<ITeam | null> => {
    // Check if a team with the same name already exists
    const existingTeam = await Team.findOne({ teamName: team.teamName });

    if (existingTeam) {
        // A team with the same team name already exists, handle this error
        throw new ApiError(httpStatus.BAD_REQUEST, "Team name already in use");
    }

    const newTeam = await Team.create(team);
    return newTeam;
};

const updateTeam = async (id: string, team: ITeam) => {
    // Check if a team with the same name already exists
    const existingTeam = await Team.findOne({ _id: id });

    if (!existingTeam) {
        // A team with the same team name already exists, handle this error
        throw new ApiError(httpStatus.BAD_REQUEST, "Team doesn't exist");
    }
    if (team.teamName) {
        const exists = await Team.findOne({ teamName: team.teamName });
        if (exists) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                "Team name already in use",
            );
        }
    }

    const updatedTeam = await Team.findByIdAndUpdate(team.teamName, team, {
        new: true,
    });
    return updatedTeam;
};

const getTeams = async (): Promise<ITeam[]> => {
    const teams = await Team.find();
    return teams;
};

const getSingleTeam = async (
    id: string,
    user: JwtPayload | IUser,
): Promise<ITeam | [] | null> => {
    if (user.role === "admin") {
        const team = await Team.findById({ _id: id });
        return team;
    } else if (user.role === "user") {
        const teamExists =
            user.teams &&
            user.teams.some(
                (team: { _id: { toString: () => string } }) =>
                    team._id.toString() === id,
            );

        if (teamExists) {
            const team = await Team.findById({ _id: id });
            return team;
        } else {
            throw new ApiError(httpStatus.BAD_REQUEST, "Team doesn't exist");
        }
    }
    
    return [];
};

export default {
    createTeam,
    updateTeam,
    getTeams,
    getSingleTeam,
};
