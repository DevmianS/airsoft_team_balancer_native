import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import PlayerClassType from "../types/playerClassType";
import { CLASS_CONFIG } from "../config/classConfig";

interface Props {
  classType: PlayerClassType;
  playerTeam?: "T" | "CT";
  size?: number;
}

const ICON_SOURCES: Record<string, ImageSourcePropType> = {
  "/icons/mg.webp": require("../../assets/icons/mg.webp"),
  "/icons/m4.webp": require("../../assets/icons/m4.webp"),
  "/icons/ak47.webp": require("../../assets/icons/ak47.webp"),
  "/icons/sniper.webp": require("../../assets/icons/sniper.webp"),
  "/icons/pistol.webp": require("../../assets/icons/pistol.webp"),
};
const ICON_SCALE: Record<string, number> = {
  "/icons/mg.webp": 1.34,
  "/icons/m4.webp": 1.42,
  "/icons/ak47.webp": 1.42,
  "/icons/sniper.webp": 1.32,
  "/icons/pistol.webp": 1.36,
};

export default function ClassIcon({
  classType,
  playerTeam,
  size = 34,
}: Props) {
  const classConfig = CLASS_CONFIG[classType];
  const iconPath =
    playerTeam === "T" && classConfig.terroristIcon
      ? classConfig.terroristIcon
      : classConfig.icon;
  const iconSource = ICON_SOURCES[iconPath];
  const iconScale = ICON_SCALE[iconPath] ?? 1.35;

  if (!iconSource) {
    return null;
  }

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Image
        source={iconSource}
        style={[styles.icon, { width: size * iconScale, height: size * iconScale }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    tintColor: "#F3F4F6",
  },
});
