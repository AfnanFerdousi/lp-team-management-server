import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import teamService from "./team.service";

const createTeam = catchAsync(
    async (req: Request, res: Response) => {
        const result = await teamService.createTeam(req.body);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Team created successfully!",
            data: result,
        })
    }
)

export {
    createTeam
}