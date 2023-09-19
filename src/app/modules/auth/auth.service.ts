import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import User from "../user/user.model";
import { ILoginUser, ILoginUserResponse } from "./auth.interface";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { string } from "zod";

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
    const { email, password } = payload;

    const userExists = await User.userExists(email);
    if (!userExists) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    if (
        userExists.password &&
        !(await User.comparePassword(password, userExists.password))
    ) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
    }

    // create access token and refresh token
    const { email: userEmail, role, needsPasswordChange } = userExists;
    const accessToken = jwtHelpers.createToken(
        { userEmail, role },
        config.jwt.jwt_refresh_secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.createToken(
        { userEmail, role },
        config.jwt.jwt_refresh_secret as Secret,
        config.jwt.refresh_expires_in as string
    )
    
    return {
        accessToken,
        refreshToken,
        needsPasswordChange
    }
};


export default {loginUser}