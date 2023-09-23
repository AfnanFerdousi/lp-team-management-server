import express from "express";
import userController from "./user.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post("/create-user",validateRequest(UserValidation.createUserValidation), userController.createUser);
router.patch(
    "/:userId/accept-invitation/:teamName",
    auth("user"),
    userController.acceptInvitation,
);
router.patch(
    "/send-invitation/:teamName",
    auth("admin"),
    userController.sendInvitation,
)
router.patch(
    "/:userId/reject-invitation/:teamName",
    auth("user"),
    userController.rejectInvitation
)
router.get("/", auth("admin", "user"), userController.getAllUsers);
router.get("/:email", auth("user", "admin"), userController.getSingleUser);
export const UserRoutes = router;
