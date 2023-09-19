import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import authService from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import config from "../../../config";
import { ILoginUserResponse } from "./auth.interface";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;
    const result = await authService.loginUser(loginData);
    const { refreshToken } = result;

    // set refresh token into cookie
    const cookieOptions = {
        secure: config.env === "production",
        httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    sendResponse<ILoginUserResponse>(res, {
        statusCode: 200,
        success: true,
        message: "User logged in successfully !",
        data: result,
    });
}
)

export default {
    loginUser
}