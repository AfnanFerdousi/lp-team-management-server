import express from 'express';
import teamController from './team.controller';
import validateRequest from '../../middlewares/validateRequest';
import { TeamValidation } from './team.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    "/create-team",
    validateRequest(TeamValidation.createTeamValidation),
    auth("admin"),
    teamController.createTeam,
);


export const TeamRoutes = router;
