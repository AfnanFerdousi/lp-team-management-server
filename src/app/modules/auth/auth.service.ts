import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import User from "../user/user.model";
import { IChangePassword, ILoginUser, ILoginUserResponse, IRefreshTokenResponse } from "./auth.interface";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
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
        { email, role },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.createToken(
        { email, role },
        config.jwt.jwt_refresh_secret as Secret,
        config.jwt.refresh_expires_in as string
    )
    
    return {
        accessToken,
        refreshToken,
        needsPasswordChange
    }
};


const refreshToken = async (
    refreshToken: string,
): Promise<IRefreshTokenResponse> => {
    let verfiedToken = null;

    try {
        verfiedToken = jwtHelpers.verifyToken(
            refreshToken,
            config.jwt.jwt_refresh_secret as Secret,
        );
    }catch (e) {
        throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token");
    }

    const { email } = verfiedToken;
    const userExists = await User.userExists(email);
    if (!userExists) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const accessToken = jwtHelpers.createToken(
        { email, role: userExists.role },
        config.jwt.jwt_refresh_secret as Secret,
        config.jwt.refresh_expires_in as string,
    );

    return {
        accessToken
    }
};


const changePassword = async (
    user: JwtPayload | null,
    payload: IChangePassword
): Promise<void> => {

    const { oldPassword, newPassword } = payload;
    
    const userExists = await User.findOne({ email: user?.email }).select(
        "+password",
    );
    
    if (!userExists) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    if (
        userExists.password &&
        !(await User.comparePassword(oldPassword, userExists.password))
    ) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
    }

    // update password
    userExists.password = newPassword;
    userExists.needsPasswordChange = false;
    await userExists.save();
}

export default {
    loginUser,
    refreshToken,
    changePassword
}