import { Server } from "http";
import mongoose, { Error } from "mongoose";
import app from "./app";
import config from "./config/index";
// import { errorLogger, logger } from "./shared/logger"; 
import { initializeSocketIO } from "./socket";

let server: Server;

process.on("uncaughtException", (err) => {
    if (err) {
        // errorLogger.error("Error connecting");
        console.log(err)
        process.exit(1);
    }
    
    // logger.info("connected");
});


async function main() {
    try {
        await mongoose.connect(config.database_url as string);
        console.log(`DB Connected`);

        server = app.listen(config.port, () => {
            console.log(`Listening on port ${config.port}`);
            // logger.info(`Application  listening on port ${config.port}`);
        });
        initializeSocketIO(server);


    } catch (error) {
        // errorLogger.error("Failed to connect DB");
        console.log("Failed to connect DB", error);
    }
    process.on("unhandledRejection", (error) => {
        if (server) {
            server.close(() => {
                // logger.info("Server closed");
                console.log(error);
            });
        } else {
            process.exit(1);
        }
    });
}

main();

