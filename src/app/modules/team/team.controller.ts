import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import teamService from "./team.service";

const createTeam = catchAsync(async (req: Request, res: Response) => {
    console.log(req.user)
        const result = await teamService.createTeam(req.body);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Team created successfully!",
            data: result,
        });
});

const getTeams = catchAsync(async (req: Request, res: Response) => {
    const result = await teamService.getTeams();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Teams fetched successfully!",
        data: result,
    })
})

const updateTeam = catchAsync(async (req: Request, res: Response) => {
    const result = await teamService.updateTeam(req.params.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Team updated successfully!",
        data: result,
    })
})
export default {
    createTeam,
    getTeams,
    updateTeam
};
