import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globarErrorHandler";
import routes from "./app/routes/routes";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";

const app: Application = express();
const corsOptions = {
    origin: "https://team-management-client-three.vercel.app", // Allow requests from this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 204, // For preflight requests (e.g., DELETE with a custom header)
};

app.use(cors(corsOptions));

// Use cookie-parser middleware
app.use(cookieParser());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("env");
// application routes
app.use("/api/v1/", routes);

// global handler
app.use(globalErrorHandler);

app.get("/", (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        success: true,
        message: "Server is running",
    });
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API Not Found",
            },
        ],
    });
    next();
});

export default app;
