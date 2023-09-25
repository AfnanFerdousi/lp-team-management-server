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

describe("User Routes", () => {
    describe.skip("POST /api/v1/user/create-user", () => {
        it("should create a new user", async () => {
            const response = await request(app)
                .post("/api/v1/user/create-user")
                .send({ username: "littleProgrammers", email: "lp@example.com", password: "password123" });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Add more assertions as needed
        });
    });

  describe.skip("PATCH /api/v1/user/send-invitation/:teamName", () => {
      it("should send an invitation", async () => {
          const response = await request(app)
              .patch("/api/v1/user/send-invitation/TeamB")
              .send({ email: "afnan@gmail.com", teamRole: "developer" })
              .set(
                  "authorization",
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NTY0ODYzNSwiZXhwIjoxNjk2NTEyNjM1fQ.ZUT0YSSQoUqlq-Z4Wvdv4vLMyO3paTblSkOKg9Tt6B8",
              );

          expect(response.status).toBe(200);
          expect(response.body.success).toBe(true);
          // Add more assertions as needed
      });
  });

    describe.skip("PATCH /api/v1/user/:userId/accept-invitation/:teamName", () => {
        it("should accept an invitation", async () => {
            const response = await request(app)
                .patch("/api/v1/user/65118b71d463c2e877daf334/accept-invitation/TeamA")
                .set(
                    "authorization",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFmbmFuQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk1NjQ4NjkwLCJleHAiOjE2OTY1MTI2OTB9.J9bVksqtoLfuU2W3BrCjJkg8HQVNzErDKJW1BCjTiaQ",
                ); // Add an appropriate token

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Add more assertions as needed
        });
    });

    describe.skip("PATCH /api/v1/user/:userId/reject-invitation/:teamName", () => {
        it("should reject an invitation", async () => {
            const response = await request(app)
                .patch("/api/v1/user/65118b71d463c2e877daf334/reject-invitation/TeamB",
                )
                .set(
                    "authorization",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFmbmFuQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk1NjQ4NjkwLCJleHAiOjE2OTY1MTI2OTB9.J9bVksqtoLfuU2W3BrCjJkg8HQVNzErDKJW1BCjTiaQ",
                ); // Add an appropriate token

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Add more assertions as needed
        });
    });

    describe.skip("GET /api/v1/user", () => {
        it("should get all users", async () => {
            const response = await request(app)
                .get("/api/v1/user")
                .set(
                    "authorization",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NTY0ODYzNSwiZXhwIjoxNjk2NTEyNjM1fQ.ZUT0YSSQoUqlq-Z4Wvdv4vLMyO3paTblSkOKg9Tt6B8",
                ); // Add an appropriate token

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Add more assertions as needed
        });
    });

    describe.skip("GET /api/v1/user/:email", () => {
        it("should get a single user", async () => {
            const response = await request(app)
                .get("/api/v1/user/afnan@gmail.com")
                .set(
                    "authorization",
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFmbmFuQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk1NjQ4NjkwLCJleHAiOjE2OTY1MTI2OTB9.J9bVksqtoLfuU2W3BrCjJkg8HQVNzErDKJW1BCjTiaQ",
                ); // Add an appropriate token

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Add more assertions as needed
        });
    });
});
