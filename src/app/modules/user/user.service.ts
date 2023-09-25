import { JwtPayload } from "jsonwebtoken";
import config from "../../../config";
import { IUser } from "./user.interface";
import User from "./user.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import Team from "../team/team.model";

const createUser = async (user: IUser): Promise<IUser | null> => {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
        // A user with the same email already exists, handle this error
        throw new Error("Email already in use");
    }

    if (!user.password) {
        user.password = config.default_user_password as string;
    }

    const newUser = await User.create(user);
    return newUser;
};

const acceptInvitation = async (
    userId: string,
    teamName: string,
): Promise<IUser | null> => {
    // Step 1: Find the teamCategory based on teamName
    const team = await Team.findOne({ teamName: teamName });

    if (!team) {
        throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
    }

    // Step 2: Update the User's teams array to change the status to "active" and remove the notification
    const updatedUser = await User.findOneAndUpdate(
        {
            _id: userId,
            "teams.teamName": teamName,
        },
        {
            $set: {
                "teams.$.status": "active",
            },
            $pull: {
                notifications: {
                    teamName: teamName,
                    type: "invitation",
                },
            },
        },
        { new: true },
    );

    return updatedUser;
};

const sendInvitation = async (
    email: string,
    teamRole: string,
    teamName: string,
    admin: JwtPayload | IUser | null,
): Promise<IUser | null> => {
    if (!admin) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Admin not authenticated");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    if (email === admin?.email) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "You cannot invite yourself",
        );
    }

    // check if team exists in users
    const teamExists =
        user.teams &&
        user.teams.some(
            (team: { teamName: string }) =>
                team.teamName.toString() === teamName,
        );
    if (teamExists) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User already in team");
    }

    // check if team exists in notifications
    const teamExistsInNotif =
        user.notifications &&
        user.notifications.some(
            (notif: { teamName: string }) => notif.teamName === teamName,
        );
    if (teamExistsInNotif) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Invitation has been sent already",
        );
    }

    // Create an object with the required properties
    const notificationData = {
        type: "invitation",
        teamName: teamName,
        teamRole: teamRole,
        sentBy: admin?.email, // Optional chaining here
    };
    const teamExist = await Team.findOne({ teamName: teamName });
    if (!teamExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
    }
    
    const teamData = {
        teamName: teamName,
        teamRole: teamRole,
        teamCategory: teamExist?.teamCategory,
        status: "pending",
    };

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            $push: { teams: teamData },
            $addToSet: { notifications: notificationData },
        },
        { new: true },
    );

    return updatedUser;
};

const rejectInvitation = async (
    userId: string,
    teamName: string,
): Promise<IUser | null> => {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $pull: {
                notifications: { teamName: teamName },
                teams: { teamName: teamName },
            },
        },
        { new: true },
    );

    return updatedUser;
};


const getAllUsers = async (
    teamName: string | undefined,
    userStatus: string | undefined
): Promise<IUser[]> => {
    let users;

    const query: any = {};

    if (teamName) {
        query["teams.teamName"] = teamName;
    }

    if (userStatus) {
        query["teams.status"] = userStatus;
    }

    try {
        users = await User.find(query).select("username email teams");
    } catch (error) {
        console.error(error);
        throw error; // Handle the error appropriately
    }

    return users;
};



const getSingleUser = async (userEmail: string): Promise<IUser | null> => {
    const user = await User.findOne({ email: userEmail });
    return user;
}


export default {
    createUser,
    acceptInvitation,
    sendInvitation,
    rejectInvitation,
    getAllUsers,
    getSingleUser,
};
