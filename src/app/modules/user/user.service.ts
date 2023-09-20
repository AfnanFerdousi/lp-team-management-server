import { JwtPayload } from "jsonwebtoken";
import config from "../../../config";
import { IUser } from "./user.interface";
import User from "./user.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

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
    userId: string, // Use userId (auto-generated _id) instead of email
    teamName: string,
): Promise<IUser | null> => {
    // Assuming you have logic to update the user's teams or other data when accepting an invitation
    const updatedUser = await User.findByIdAndUpdate(
        userId, // Use userId (auto-generated _id)
        { $addToSet: { teams: teamName } },
        { new: true },
    );

    return updatedUser;
};

const sendInvitation = async (
    email: string,
    teamName: string,
    admin: JwtPayload | IUser | null,
): Promise<IUser | null> => {
    console.log(email);
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
        sentBy: admin?.email, // Optional chaining here
    };

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { notifications: notificationData } },
        { new: true },
    );

    return updatedUser;
};

export default { createUser, acceptInvitation, sendInvitation };
