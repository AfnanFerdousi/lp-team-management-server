"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/create-user", user_controller_1.default.createUser);
router.patch("/:userId/accept-invitation/:teamName", (0, auth_1.default)("user"), user_controller_1.default.acceptInvitation);
router.patch("/send-invitation/:teamName", (0, auth_1.default)("admin"), user_controller_1.default.sendInvitation);
router.patch("/:userId/reject-invitation/:teamName", (0, auth_1.default)("user"), user_controller_1.default.rejectInvitation);
router.get("/", (0, auth_1.default)("admin"), user_controller_1.default.getAllUsers);
exports.UserRoutes = router;
