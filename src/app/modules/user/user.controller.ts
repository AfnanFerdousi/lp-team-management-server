import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import userService from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import { IUser } from "./user.interface";
import httpStatus from "http-status";

const createUser: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const result = await userService.createUser(req.body);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User created successfully!",
            data: result,
        });
    },
);

const acceptInvitation: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId; // Assuming you pass the user ID as a parameter
    const teamName = req.params.teamName; // Assuming you pass the team ID as a parameter

    const result = await userService.acceptInvitation(userId, teamName);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Invitation accepted successfully!",
      data: result,
    });
  }
);

export default {
    createUser,
    acceptInvitation
};
