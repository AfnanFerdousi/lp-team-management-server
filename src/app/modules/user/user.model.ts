import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, UserModel } from "./user.interface";
import config from "../../../config";

const TeamSchema = new Schema(
    {
        teamName: {
            type: String,
        },
        teamCategory: {
            type: String,
        },
        description: {
            type: String,
        },
        teamRole: {
            type: String,
        },
        status: {
            type: String,
            enum: ["active", "pending", "rejected"],
            default: "pending",
        },
    },
    { _id: false }, // Exclude _id field for subdocuments
);

const UserSchema = new Schema<IUser, UserModel>(
    {
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
        teams: {
            type: [TeamSchema],
            default: [],
        }, // Use the TeamSchema for the teams array
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
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    },
);

UserSchema.statics.userExists = async function (
    email: string,
): Promise<IUser | null> {
    return await User.findOne(
        { email },
        { email: 1, password: 1, role: 1, needsPasswordChange: 1 },
    );
};

UserSchema.statics.comparePassword = async function (
    givenPassword: string,
    savedPassword: string,
): Promise<boolean> {
    return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.methods.changedPasswordAfterJwtIssued = function (
    jwtTimestamp: number,
) {
    console.log({ jwtTimestamp }, "hi");
};

// User.create() / user.save()
UserSchema.pre("save", async function (next) {
    // hashing user password
    const user = this;
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds),
    );

    if (!user.needsPasswordChange) {
        user.passwordChangedAt = new Date();
    }

    next();
});

const User = mongoose.model<IUser, UserModel>("User", UserSchema);

export default User;
