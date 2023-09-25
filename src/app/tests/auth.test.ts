import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";

// Initialize Mongoose connection before tests
beforeAll(async () => {
    await mongoose.connect(
        "mongodb+srv://afnanferdousi550:gjxGrOPXrLUQkbT6@cluster0.4qe1ml2.mongodb.net/?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions,
    );
});

// Close Mongoose connection after tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe("Authentication Routes", () => {
    describe("POST /api/v1/auth/login", () => {
        it("should log in a user and return an access token and refresh token", async () => {
            const userData = {
                email: "afnan@gmail.com",
                password: "12345678",
            };

            const response = await request(app)
                .post("/api/v1/auth/login")
                .send(userData);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Add more assertions as needed
        });
    });

    describe.skip("POST /api/v1/auth/change-password", () => {
        it("should change a user's password", async () => {
            const changePasswordData = {
                oldPassword: "12345678",
                newPassword: "new_password123",
            };

            const response = await request(app)
                .post("/api/v1/auth/change-password")
                .send(changePasswordData)
                .set(
                    "authorization",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYW5nZUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTY5NTY2MDI2MywiZXhwIjoxNjk2NTI0MjYzfQ.3R1YNKv2o_-zHDfOaINVJ9gYq6-fvP9Q4FZR6MqGVGE",
                ); // Replace with a valid authorization token

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Add more assertions as needed
        });
    });
});
