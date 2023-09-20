import express from 'express';
import teamController from './team.controller';
import validateRequest from '../../middlewares/validateRequest';
import { TeamValidation } from './team.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get("/", auth("admin"), teamController.getTeams);
router.get("/:id", auth("user","admin"), teamController.getSingleTeam);
router.post(
    "/create-team",
    validateRequest(TeamValidation.createTeamValidation),
    auth("admin"),
    teamController.createTeam,
);
router.patch(
    "/update-team/:id",
    validateRequest(TeamValidation.updateTeamValidation),
    auth("admin"),
    teamController.updateTeam,
)


export const TeamRoutes = router;
