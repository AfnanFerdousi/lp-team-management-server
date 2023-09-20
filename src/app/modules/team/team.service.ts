import { ITeam } from "./team.interface";
import Team from "./team.model";

const createTeam = async (team: ITeam): Promise<ITeam | null> => {
    // Check if a team with the same name already exists
    const existingTeam = await Team.findOne({ teamName: team.teamName });

    if (existingTeam) {
        // A team with the same team name already exists, handle this error
        throw new Error("Team name already in use");
    }

    const newTeam = await Team.create(team);
    return newTeam;
}

export default {
    createTeam
}