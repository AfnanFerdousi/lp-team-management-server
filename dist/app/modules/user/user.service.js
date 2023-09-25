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
const config_1 = __importDefault(require("../../../config"));
const user_model_1 = __importDefault(require("./user.model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const team_model_1 = __importDefault(require("../team/team.model"));
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if a user with the same email already exists
    const existingUser = yield user_model_1.default.findOne({ email: user.email });
    if (existingUser) {
        // A user with the same email already exists, handle this error
        throw new Error("Email already in use");
    }
    if (!user.password) {
        user.password = config_1.default.default_user_password;
    }
    const newUser = yield user_model_1.default.create(user);
    return newUser;
});
const acceptInvitation = (userId, teamName) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Find the teamCategory based on teamName
    const team = yield team_model_1.default.findOne({ teamName: teamName });
    if (!team) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Team not found");
    }
    // Step 2: Update the User's teams array to change the status to "active" and remove the notification
    const updatedUser = yield user_model_1.default.findOneAndUpdate({
        _id: userId,
        "teams.teamName": teamName,
    }, {
        $set: {
            "teams.$.status": "active",
        },
        $pull: {
            notifications: {
                teamName: teamName,
                type: "invitation",
            },
        },
    }, { new: true });
    return updatedUser;
});
const sendInvitation = (email, teamRole, teamLogo, teamName, admin) => __awaiter(void 0, void 0, void 0, function* () {
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Admin not authenticated");
    }
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (email === (admin === null || admin === void 0 ? void 0 : admin.email)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You cannot invite yourself");
    }
    // check if team exists in users
    const teamExists = user.teams &&
        user.teams.some((team) => team.teamName.toString() === teamName);
    if (teamExists) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User already in team");
    }
    // check if team exists in notifications
    const teamExistsInNotif = user.notifications &&
        user.notifications.some((notif) => notif.teamName === teamName);
    if (teamExistsInNotif) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invitation has been sent already");
    }
    // Create an object with the required properties
    const notificationData = {
        type: "invitation",
        teamName: teamName,
        teamRole: teamRole,
        teamLogo: teamLogo,
        sentBy: admin === null || admin === void 0 ? void 0 : admin.email, // Optional chaining here
    };
    const teamExist = yield team_model_1.default.findOne({ teamName: teamName });
    if (!teamExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Team not found");
    }
    const teamData = {
        teamName: teamName,
        teamRole: teamRole,
        teamLogo: teamLogo,
        teamCategory: teamExist === null || teamExist === void 0 ? void 0 : teamExist.teamCategory,
        status: "pending",
    };
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(user._id, {
        $push: { teams: teamData },
        $addToSet: { notifications: notificationData },
    }, { new: true });
    return updatedUser;
});
const rejectInvitation = (userId, teamName) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, {
        $pull: {
            notifications: { teamName: teamName },
            teams: { teamName: teamName },
        },
    }, { new: true });
    return updatedUser;
});
const getAllUsers = (teamName, userStatus) => __awaiter(void 0, void 0, void 0, function* () {
    let users;
    const query = {};
    if (teamName) {
        query["teams.teamName"] = teamName;
    }
    if (userStatus) {
        query["teams.status"] = userStatus;
    }
    try {
        users = yield user_model_1.default.find(query).select("username email teams");
    }
    catch (error) {
        console.error(error);
        throw error; // Handle the error appropriately
    }
    return users;
});
const getSingleUser = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: userEmail });
    return user;
});
exports.default = {
    createUser,
    acceptInvitation,
    sendInvitation,
    rejectInvitation,
    getAllUsers,
    getSingleUser,
};
