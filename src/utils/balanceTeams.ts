import { CLASS_CONFIG } from "../config/classConfig";
import PlayerType from "../types/playerType";

interface BalancedTeams {
  terrorists: PlayerType[];
  counterTerrorists: PlayerType[];
}

export default function balanceTeams(allPlayers: PlayerType[]): BalancedTeams {
  const allPlayersReduced = allPlayers.filter((player) => !player.disabled);

  const MAX_ATTEMPTS = 100;
  let bestTerrorists: PlayerType[] = [];
  let bestCounterTerrorists: PlayerType[] = [];
  let smallestDiff = Infinity;

  for (let i = 0; i < MAX_ATTEMPTS; i += 1) {
    const shuffled = [...allPlayersReduced].sort(() => Math.random() - 0.5);

    const terrorists: PlayerType[] = [];
    const counterTerrorists: PlayerType[] = [];
    let terrorPoints = 0;
    let ctPoints = 0;

    shuffled.forEach((player) => {
      const points = CLASS_CONFIG[player.class].points;
      if (terrorPoints <= ctPoints) {
        terrorists.push(player);
        terrorPoints += points;
      } else {
        counterTerrorists.push(player);
        ctPoints += points;
      }
    });

    const diff = Math.abs(terrorPoints - ctPoints);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      bestTerrorists = terrorists;
      bestCounterTerrorists = counterTerrorists;
    }

    if (diff <= 1) {
      break;
    }
  }

  return {
    terrorists: bestTerrorists,
    counterTerrorists: bestCounterTerrorists,
  };
}
