import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validaion";
import authController from "./auth.controller";

const router = express.Router();

router.post(
    "/login",
    validateRequest(AuthValidation.loginZodSchema),
    authController.loginUser,
);

export const AuthRoutes = router;
