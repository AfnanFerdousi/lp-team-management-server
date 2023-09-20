import config from "../../../config";
import { IUser } from "./user.interface";
import User from "./user.model";

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


export default { createUser, acceptInvitation };
