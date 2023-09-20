"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validaion_1 = require("./auth.validaion");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const router = express_1.default.Router();
router.post("/login", (0, validateRequest_1.default)(auth_validaion_1.AuthValidation.loginZodSchema), auth_controller_1.default.loginUser);
router.post("/refresh", (0, validateRequest_1.default)(auth_validaion_1.AuthValidation.refreshTokenZodSchema), auth_controller_1.default.refreshToken);
router.post("/change-password", (0, validateRequest_1.default)(auth_validaion_1.AuthValidation.changePasswordZodSchema), (0, auth_1.default)('user', 'admin'), auth_controller_1.default.changePassword);
exports.AuthRoutes = router;
