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

const sendInvitation: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const { email } = req.body; // Assuming you pass the user ID as a parameter
        const teamName = req.params.teamName; 

        const result = await userService.sendInvitation(
            email,
            teamName,
            req.user,
        );

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Invitation sent successfully!",
            data: result,
        });
    },
);

const acceptInvitation: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.params.userId; 
        const teamName = req.params.teamName; 
        const result = await userService.acceptInvitation(userId, teamName);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Invitation accepted successfully!",
            data: result,
        });
    },
);

const rejectInvitation: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.params.userId; 
        const teamName = req.params.teamName; 
        const result = await userService.rejectInvitation(userId, teamName);

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Invitation rejected successfully!",
            data: result,
        })
    }
)
export default {
    createUser,
    acceptInvitation,
    sendInvitation,
    rejectInvitation
};
