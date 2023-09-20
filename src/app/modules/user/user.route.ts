import express from "express";
import userController from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/create-user", userController.createUser);
router.patch(
    "/:userId/accept-invitation/:teamName",
    userController.acceptInvitation,
);
router.patch(
    "/send-invitation/:teamName",
    auth("admin"),
    userController.sendInvitation,
)

export const UserRoutes = router;
