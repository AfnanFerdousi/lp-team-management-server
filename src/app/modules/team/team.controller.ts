import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import teamService from "./team.service";

const createTeam = catchAsync(async (req: Request, res: Response) => {
        const result = await teamService.createTeam(req.body);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Team created successfully!",
            data: result,
        });
});


const updateTeam = catchAsync(async (req: Request, res: Response) => {
    const result = await teamService.updateTeam(req.params.teamName, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Team updated successfully!",
        data: result,
    })
})

const getTeams = catchAsync(async (req: Request, res: Response) => {
    const result = await teamService.getTeams();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Teams fetched successfully!",
        data: result,
    });
});

const getSingleTeam = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        // Handle the case where req.user is null, e.g., return an error response
        sendResponse(res, {
            statusCode: httpStatus.UNAUTHORIZED, // or any appropriate status code
            success: false,
            message: "User not authenticated",
        });
        return;
    }

    const result = await teamService.getSingleTeam(
        req.params.teamName,
        req.user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Team fetched successfully!",
        data: result,
    });
});

const deleteTeam = catchAsync(async (req: Request, res: Response) => {
    const result = await teamService.deleteTeam(req.params.teamName);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Team deleted successfully!",
        data: result,
    })
})


export default {
    createTeam,
    updateTeam,
    getTeams,
    getSingleTeam,
    deleteTeam
};
