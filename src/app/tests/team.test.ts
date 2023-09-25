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

describe("Team Routes", () => {
    describe.skip("GET /api/v1/team", () => {
        it("should get all teams", async () => {
            const response = await request(app)
                .get("/api/v1/team")
                .set(
                    "authorization",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NTY1OTY4MCwiZXhwIjoxNjk2NTIzNjgwfQ.fOGvwqievU-4KaJ2Y2JE-YjRpWJiyZTumQ0Wa0ekLPE",
                ); 
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Add more assertions as needed
        });
    });

    describe.skip("GET /api/v1/team/:teamName", () => {
        it("should get a single team", async () => {
            const response = await request(app)
                .get("/api/v1/team/TeamA") // Replace with an existing team name
                .set(
                    "authorization",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NTY1OTY4MCwiZXhwIjoxNjk2NTIzNjgwfQ.fOGvwqievU-4KaJ2Y2JE-YjRpWJiyZTumQ0Wa0ekLPE",
                ); // Replace with a valid authorization token

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Add more assertions as needed
        });
    });

    describe.skip("POST /api/v1/team/create-team", () => {
        it("should create a new team", async () => {
            const teamData = {
                teamName: "TestTeam",
                teamLogo:
                    "https://play-lh.googleusercontent.com/ahJtMe0vfOlAu1XJVQ6rcaGrQBgtrEZQefHy7SXB7jpijKhu1Kkox90XDuH8RmcBOXNn",
                teamCategory: "Development",
                description:
                    "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available",
            };

            const response = await request(app)
                .post("/api/v1/team/create-team")
                .send(teamData)
                .set(
                    "authorization",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NTY1OTY4MCwiZXhwIjoxNjk2NTIzNjgwfQ.fOGvwqievU-4KaJ2Y2JE-YjRpWJiyZTumQ0Wa0ekLPE",
                ); // Replace with a valid authorization token

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Add more assertions as needed
        });
    });

    describe.skip("PATCH /api/v1/team/update-team/:teamName", () => {
        it("should update a team", async () => {
            const updatedTeamData = {
                teamCategory: "Testing"
            };

            const response = await request(app)
                .patch("/api/v1/team/update-team/TeamA") // Replace with an existing team name
                .send(updatedTeamData)
                .set(
                    "authorization",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NTY1OTY4MCwiZXhwIjoxNjk2NTIzNjgwfQ.fOGvwqievU-4KaJ2Y2JE-YjRpWJiyZTumQ0Wa0ekLPE",
                ); // Replace with a valid authorization token

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Add more assertions as needed
        });
    });

    describe.skip("DELETE /api/v1/team/:teamName", () => {
        it("should delete a team", async () => {
            const response = await request(app)
                .delete("/api/v1/team/Test") // Replace with an existing team name
                .set(
                    "authorization",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NTY1OTY4MCwiZXhwIjoxNjk2NTIzNjgwfQ.fOGvwqievU-4KaJ2Y2JE-YjRpWJiyZTumQ0Wa0ekLPE",
                ); // Replace with a valid authorization token

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Add more assertions as needed
        });
    });
});
