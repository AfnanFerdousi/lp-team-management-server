"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const UserSchema = new mongoose_1.Schema({
    // Remove the custom "id" field
    username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "user"],
        default: "user",
    },
    teams: [
        {
            teamName: {
                type: String,
                unique: true,
                required: true,
                minlength: 2,
                maxlength: 50,
            },
            teamCategory: {
                type: String,
                required: true,
                maxlength: 100,
            },
            status: {
                type: String,
                enum: ["active", "pending", "rejected"],
                default: "pending",
            },
        },
    ],
    notifications: [
        {
            type: {
                type: String,
                enum: ["invitation"],
            },
            teamName: {
                type: String,
            },
            sentBy: {
                type: String,
                ref: "User",
            },
            status: {
                type: String,
                enum: ["accepted", "rejected", "pending"],
                default: "pending",
            },
        },
    ],
    needsPasswordChange: {
        type: Boolean,
        default: true,
    },
    passwordChangedAt: {
        type: Date,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
UserSchema.statics.userExists = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User.findOne({ email }, { email: 1, password: 1, role: 1, needsPasswordChange: 1 });
    });
};
UserSchema.statics.comparePassword = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
};
UserSchema.methods.changedPasswordAfterJwtIssued = function (jwtTimestamp) {
    console.log({ jwtTimestamp }, "hi");
};
// User.create() / user.save()
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // hashing user password
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        if (!user.needsPasswordChange) {
            user.passwordChangedAt = new Date();
        }
        next();
    });
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
