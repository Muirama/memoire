import { teams } from "../data/TeamData";

// récupérer toutes les équipes
export const getTeams = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(teams), 300);
  });
};

// récupérer une équipe par ID
export const getTeamById = (id) => {
  return new Promise((resolve, reject) => {
    const team = teams.find((t) => String(t.id) === String(id));

    setTimeout(() => {
      if (team) resolve(team);
      else reject("Équipe introuvable");
    }, 300);
  });
};