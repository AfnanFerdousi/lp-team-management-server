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
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.password) {
        user.password = config_1.default.default_user_password;
    }
    const newUser = yield user_model_1.default.create(user);
    return newUser;
});
const acceptInvitation = (userId, teamName) => __awaiter(void 0, void 0, void 0, function* () {
    // Assuming you have logic to update the user's teams or other data when accepting an invitation
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { $addToSet: { teams: teamName } }, // Add the team to the user's teams array
    { new: true });
    return updatedUser;
});
exports.default = { createUser, acceptInvitation };
