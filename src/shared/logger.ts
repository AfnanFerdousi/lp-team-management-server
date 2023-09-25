// import path from "path";
// import { createLogger, format, transports } from "winston";
// import DailyRotateFile from "winston-daily-rotate-file";
// const { combine, timestamp, label, printf } = format;

// const myFormat = printf(({ level, message, label, timestamp }) => {
//     const date = new Date(timestamp);
//     const hour = date.getHours();
//     const minutes = date.getMinutes();
//     const seconds = date.getSeconds();
//     return `${date.toDateString()} ${hour}:${minutes}:${seconds} [${label}] ${level}: ${message}`;
// });

// const logger = createLogger({
//     level: "info",
//     format: combine(label({ label: "TMS" }), timestamp(), myFormat),
//     transports: [
//         new transports.Console(),
//         new DailyRotateFile({
//             filename: path.join(
//                 process.cwd(),
//                 "logs",
//                 "winston",
//                 "successes",
//                 "tm-%DATE%-success.log",
//             ),
//             datePattern: "YYYY-DD-MM-HH",
//             zippedArchive: true,
//             maxSize: "20m",
//             maxFiles: "14d",
//         }),
//         // Add a new transport for "debug" logs
//         new transports.DailyRotateFile({
//             filename: path.join(
//                 process.cwd(),
//                 "logs",
//                 "winston",
//                 "debug",
//                 "tm-%DATE%-debug.log",
//             ),
//             level: "debug", // Set the logging level to "debug"
//             datePattern: "YYYY-DD-MM-HH",
//             zippedArchive: true,
//             maxSize: "20m",
//             maxFiles: "14d",
//         }),
//     ],
// });

// const errorLogger = createLogger({
//     level: "error",
//     format: combine(label({ label: "TMS" }), timestamp(), myFormat),
//     transports: [
//         new transports.Console(),
//         new DailyRotateFile({
//             filename: path.join(
//                 process.cwd(),
//                 "logs",
//                 "winston",
//                 "errors",
//                 "tm-%DATE%-error.log",
//             ),
//             datePattern: "YYYY-DD-MM-HH",
//             zippedArchive: true,
//             maxSize: "20m",
//             maxFiles: "14d",
//         }),
//     ],
// });

// export { logger, errorLogger };
