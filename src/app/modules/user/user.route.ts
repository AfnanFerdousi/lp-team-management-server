import express from "express";
import userController from "./user.controller";

const router = express.Router();

router.post("/create-user", userController.createUser);
router.patch(
    "/:userId/accept-invitation/:teamName",
    userController.acceptInvitation,
);

export const UserRoutes = router;
