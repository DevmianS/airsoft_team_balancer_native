import PlayerClassType from "../types/playerClassType";

interface ClassConfig {
  points: number;
  icon: string;
  terroristIcon?: string;
}

// Source web image assets are not present in this repository snapshot,
// so mobile uses emoji placeholders for class visuals.
export const CLASS_CONFIG: Record<PlayerClassType, ClassConfig> = {
  Machinegunner: {
    points: 40,
    icon: "💥",
  },
  Rifleman: {
    points: 35,
    icon: "🔫",
    terroristIcon: "🟥",
  },
  Sniper: {
    points: 30,
    icon: "🎯",
  },
  Sidearm: {
    points: 20,
    icon: "🫡",
  },
};
