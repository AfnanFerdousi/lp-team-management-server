import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../helpers/jwtHelpers";

const auth =
    (...requiredRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new ApiError(
                    httpStatus.UNAUTHORIZED,
                    "You are not authorized",
                );
            }
            let verifiedUser = null;

            verifiedUser = jwtHelpers.verifyToken(
                token,
                config.jwt.jwt_secret as Secret,
            );

            // Check if verifiedUser is null and handle it accordingly
            if (!verifiedUser) {
                throw new ApiError(
                    httpStatus.UNAUTHORIZED,
                    "You are not authorized",
                );
            }

            req.user = verifiedUser;
            if (
                requiredRoles.length &&
                !requiredRoles.includes(verifiedUser.role)
            ) {
                throw new ApiError(httpStatus.FORBIDDEN, "FORBIDDEN");
            }
            next();
        } catch (error) {
            next(error);
        }
    };

export default auth;
