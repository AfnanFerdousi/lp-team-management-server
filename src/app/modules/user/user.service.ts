import config from "../../../config";
import { IUser } from "./user.interface";
import User from "./user.model";

const createUser = async (user: IUser): Promise<IUser | null> => {
    if (!user.password) {
        user.password = (await config.default_user_password) as string;
    }
    const newUser = await User.create(user);
    return newUser;
};

const acceptInvitation = async (
    userId: string,
    teamName: string,
): Promise<IUser | null> => {
    // Assuming you have logic to update the user's teams or other data when accepting an invitation
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { teams: teamName } }, // Add the team to the user's teams array
        { new: true },
    );

    return updatedUser;
};

export default { createUser, acceptInvitation };
