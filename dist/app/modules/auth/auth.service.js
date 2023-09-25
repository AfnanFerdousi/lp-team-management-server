"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = __importDefault(require("../user/user.model"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const userExists = yield user_model_1.default.userExists(email);
    if (!userExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (userExists.password &&
        !(yield user_model_1.default.comparePassword(password, userExists.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Password is incorrect");
    }
    // Map the userExists data to match the structure of ILoginUserResponse.user
    const { email: userEmail, role, needsPasswordChange, } = userExists;
    // Create access token and refresh token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ email, role }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ email, role }, config_1.default.jwt.jwt_refresh_secret, config_1.default.jwt.refresh_expires_in);
    // Create a user object that matches the ILoginUserResponse.user structure
    const user = {
        email: userEmail,
        role,
        needsPasswordChange
    };
    return {
        user,
        accessToken,
        refreshToken,
    };
});
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    let verfiedToken = null;
    try {
        verfiedToken = jwtHelpers_1.jwtHelpers.verifyToken(refreshToken, config_1.default.jwt.jwt_refresh_secret);
    }
    catch (e) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token");
    }
    const { email } = verfiedToken;
    const userExists = yield user_model_1.default.userExists(email);
    if (!userExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ email, role: userExists.role }, config_1.default.jwt.jwt_refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    const userExists = yield user_model_1.default.findOne({ email: user === null || user === void 0 ? void 0 : user.email }).select("+password");
    if (!userExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (userExists.password &&
        !(yield user_model_1.default.comparePassword(oldPassword, userExists.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Password is incorrect");
    }
    // update password
    userExists.password = newPassword;
    userExists.needsPasswordChange = false;
    yield userExists.save();
});
exports.default = {
    loginUser,
    refreshToken,
    changePassword
};
