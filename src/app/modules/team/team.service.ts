import { ITeam } from "./team.interface";
import Team from "./team.model";
import User from "../user/user.model"; // Import the User model
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IUser } from "../user/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { errorLogger, logger } from "../../../shared/logger";

const createTeam = async (team: ITeam): Promise<ITeam | null> => {
    logger.debug("Attempting to create a new team");
    // Check if a team with the same name already exists
    const existingTeam = await Team.findOne({ teamName: team.teamName });

    if (existingTeam) {
        // A team with the same team name already exists, handle this error
        errorLogger.error("Team name already in use");
        throw new ApiError(httpStatus.BAD_REQUEST, "Team name already in use");
    }

    const newTeam = await Team.create(team);
    logger.info("Team created successfully");
    return newTeam;
};

const updateTeam = async (id: string, team: ITeam) => {
    logger.debug(`Attempting to update team with ID: ${id}`);

    // Check if a team with the same name already exists
    const existingTeam = await Team.findOne({ _id: id });

    if (!existingTeam) {
        // A team with the same team name already exists, handle this error
        errorLogger.error("Team doesn't exist");
        throw new ApiError(httpStatus.BAD_REQUEST, "Team doesn't exist");
    }
    if (team.teamName) {
        const exists = await Team.findOne({ teamName: team.teamName });
        if (exists) {
            errorLogger.error("Team name already in use");
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                "Team name already in use",
            );
        }
    }

    const updatedTeam = await Team.findByIdAndUpdate(team.teamName, team, {
        new: true,
    });
    logger.info("Team updated successfully");
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

const deleteTeam = async (id: string) => {
    logger.debug(`Attempting to delete team with ID: ${id}`);
    
    const deletedTeam = await Team.findByIdAndDelete(id);
    if (!deletedTeam) {
        errorLogger.error("Team doesn't exist");
         throw new ApiError(
             httpStatus.NOT_FOUND,
             "Team doesn't exist",
         );
    }
    
     const usersToUpdate = await User.find({
         "teams.teamName": deletedTeam.teamName,
     });
    
    await Promise.all(
        usersToUpdate.map(async user => {
            user.teams = user.teams.filter(
                team => team.teamName !== deletedTeam.teamName,
            );
            await user.save();
        }),
    );

    logger.info("Team deleted successfully");

    return deletedTeam;
}

export default {
    createTeam,
    updateTeam,
    getTeams,
    getSingleTeam,
    deleteTeam
};
