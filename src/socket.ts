// Inside socket.ts
import { Server as SocketIOServer, Socket } from "socket.io";
// import { errorLogger, logger } from "./shared/logger";

let io: SocketIOServer;

export const initializeSocketIO = (server: any) => {
     io = new SocketIOServer(server, {
         cors: {
             origin: "https://team-management-client-three.vercel.app", // Allow connections from this origin
             methods: ["GET", "POST"],
             credentials: true,
         },
     });

    io.on("connection", (socket: Socket) => {
        // logger.info("A user connected to Socket.IO");
        console.log("A user connected to Socket.IO");

        socket.on("disconnect", () => {
            // errorLogger.error("A user disconnected from Socket.IO");
            console.log("A user disconnected from Socket.IO");
        });
    });
};

export const getSocketIO = () => {
    if (!io) {
        throw new Error("Socket.IO is not initialized.");
    }
    return io;
};
