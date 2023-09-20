/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../app/modules/user/user.interface";

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload |  null;
        }
    }
}
