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

const updateTeam = async (teamName: string, team: ITeam) => {
    logger.debug(`Attempting to update team with ID: ${teamName}`);

    // Check if a team with the same name already exists
    const existingTeam = await Team.findOne({ teamName: teamName });

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
    teamName: string,
    user: JwtPayload | IUser,
): Promise<ITeam | null> => {
    if (user.role === "admin") {
        const team = await Team.findOne({ teamName: teamName });
        return team;
    } else if (user.role === "user") {
        const normalUser = await User.findOne({ email: user.email });
        const teamExists =
            normalUser?.teams &&
            normalUser?.teams.some(
                (team: { teamName: { toString: () => string } }) =>
                    team.teamName.toString() === teamName,
            );
        if (teamExists) {
            const team = await Team.findOne({ teamName: teamName }); 
            return team;
        } else {
            throw new ApiError(httpStatus.BAD_REQUEST, "Team doesn't exist");
        }
    }

    return null;
};


const deleteTeam = async (teamName: string) => {
    logger.debug(`Attempting to delete team with ID: ${teamName}`);
    
    const deletedTeam = await Team.findOneAndDelete({ teamName: teamName });
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
