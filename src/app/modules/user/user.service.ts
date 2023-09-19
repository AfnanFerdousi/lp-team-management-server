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

export default { createUser };
