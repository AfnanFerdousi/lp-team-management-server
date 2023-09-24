import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import userService from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import { IUser } from "./user.interface";
import httpStatus from "http-status";
import { getSocketIO } from "../../../socket";

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
        const { email, teamRole } = req.body; // Assuming you pass the user ID as a parameter
        const teamName = req.params.teamName; 

  const timestamp = new Date();
        const result = await userService.sendInvitation(
            email,
            teamRole,
            teamName,
            req.user,
        );
          const io = getSocketIO();
              io.emit("invitationSent", { email, teamName, user: req.user , timestamp});
          

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

        // Get the current timestamp
        const timestamp = new Date();

       const io = getSocketIO();
           io.emit("invitationAccepted", { teamName, user: req.user, timestamp});
   

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

        // Get the current timestamp
        const timestamp = new Date();

        const io = getSocketIO();
            io.emit("invitationRejected", { teamName, user: req.user, timestamp });

        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Invitation rejected successfully!",
            data: result,
        });
    },
);

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const { teamName, status } = req.query;
    const result = await userService.getAllUsers(
        teamName as string,
        status as string,
    );
    sendResponse<IUser[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users fetched successfully!",
        data: result,
    });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.params;
    const result = await userService.getSingleUser(email);
    sendResponse<IUser>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User fetched successfully!",
        data: result,
    });
})

export default {
    createUser,
    acceptInvitation,
    sendInvitation,
    rejectInvitation,
    getAllUsers,
    getSingleUser
};
