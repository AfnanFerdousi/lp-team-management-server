import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { TeamRoutes } from "../modules/team/team.route";

const routes = express.Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/team",
        route: TeamRoutes
    }
]

moduleRoutes.forEach(route => routes.use(route.path, route.route));

export default routes;