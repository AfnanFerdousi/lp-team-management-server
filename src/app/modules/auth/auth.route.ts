import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validaion";
import authController from "./auth.controller";

const router = express.Router();

router.post(
    "/login",
    validateRequest(AuthValidation.loginZodSchema),
    authController.loginUser,
);
router.post(
    "/refresh",
    validateRequest(AuthValidation.refreshTokenZodSchema),
    authController.refreshToken,
)

router.post(
    "/change-password",
    validateRequest(AuthValidation.changePasswordZodSchema),
    auth('user', 'admin'),
    authController.changePassword
)

export const AuthRoutes = router;
