import PlayerClassType from "../types/playerClassType";

interface ClassConfig {
  points: number;
  icon: string;
  terroristIcon?: string;
}

export const CLASS_CONFIG: Record<PlayerClassType, ClassConfig> = {
  Machinegunner: {
    points: 40,
    icon: "/icons/mg.webp",
  },
  Rifleman: {
    points: 35,
    icon: "/icons/m4.webp",
    terroristIcon: "/icons/ak47.webp",
  },
  Sniper: {
    points: 30,
    icon: "/icons/sniper.webp",
  },
  Sidearm: {
    points: 20,
    icon: "/icons/pistol.webp",
  },
};
