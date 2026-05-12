import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import PlayerType from "../types/playerType";
import PlayerClassType from "../types/playerClassType";
import ClassSelectionModal from "./ClassSelectionModal";
import ClassIcon from "./ClassIcon";
import { APP_FONT_FAMILY } from "../config/fonts";

interface Props {
  player: PlayerType;
  playerTeam?: "T" | "CT";
  onDelete?: (playerId: string) => void;
  onToggleClass?: (playerId: string, classType: PlayerClassType) => void;
  onToggleDisabled?: (playerId: string) => void;
  disableActions?: boolean;
}

export default function PlayerCard({
  player,
  playerTeam,
  onDelete,
  onToggleClass,
  onToggleDisabled,
  disableActions,
}: Props) {
  const [showModifyButtons, setShowModifyButtons] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);

  const teamStyles = playerTeam === "T" ? styles.terroristCard : playerTeam === "CT" ? styles.counterCard : null;
  const isTeamCard = Boolean(playerTeam);

  return (
    <>
      <Pressable
        style={[
          styles.card,
          !isTeamCard && styles.defaultCard,
          isTeamCard && styles.teamCard,
          teamStyles,
          player.disabled && styles.disabledCard,
        ]}
        onPress={() => {
          if (!playerTeam && !disableActions) {
            setShowModifyButtons((state) => !state);
          }
        }}
      >
        <Text numberOfLines={1} style={[styles.playerName, isTeamCard && styles.teamPlayerName]}>
          {player.name.toUpperCase()}
        </Text>
        <View
          style={[
            styles.iconContainer,
            !isTeamCard && styles.defaultIconContainer,
            isTeamCard && styles.teamIconContainer,
            playerTeam === "T" && styles.terroristIconContainer,
            playerTeam === "CT" && styles.counterIconContainer,
          ]}
        >
          <ClassIcon classType={player.class} playerTeam={playerTeam} size={isTeamCard ? 56 : 44} />
        </View>

        {!disableActions && showModifyButtons && (
          <View style={styles.buttonRow}>
            <Pressable style={[styles.actionButton, styles.classButton]} onPress={() => setShowClassModal(true)}>
              <Text style={styles.actionButtonText}>CLASS</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.disableButton]}
              onPress={() => onToggleDisabled?.(player.id)}
            >
              <Text style={styles.actionButtonText}>{player.disabled ? "ENABLE" : "DISABLE"}</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={() => onDelete?.(player.id)}>
              <Text style={styles.actionButtonText}>DELETE</Text>
            </Pressable>
          </View>
        )}
      </Pressable>

      <ClassSelectionModal
        isOpen={showClassModal}
        onClose={() => setShowClassModal(false)}
        onSelect={(classType) => onToggleClass?.(player.id, classType)}
        currentClass={player.class}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    backgroundColor: "#374151",
    width: "100%",
    gap: 8,
    borderWidth: 1,
    borderColor: "#4B5563",
  },
  defaultCard: {
    minHeight: 96,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamCard: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  terroristCard: {
    backgroundColor: "#8D6246",
    borderColor: "#B98A5A",
  },
  counterCard: {
    backgroundColor: "#2D7AA9",
    borderColor: "#64A9D4",
  },
  disabledCard: {
    opacity: 0.45,
  },
  playerName: {
    color: "#FFFFFF",
    fontSize: 22,
    maxWidth: "72%",
    textAlign: "left",
    letterSpacing: 0.2,
    fontFamily: APP_FONT_FAMILY,
  },
  teamPlayerName: {
    maxWidth: "100%",
    width: "100%",
    textAlign: "center",
    fontSize: 20,
    borderRadius: 10,
    backgroundColor: "rgba(17,24,39,0.35)",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  iconContainer: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  defaultIconContainer: {
    width: 82,
    height: 82,
    backgroundColor: "#1F2937",
  },
  teamIconContainer: {
    width: 132,
    height: 96,
    backgroundColor: "rgba(17,24,39,0.32)",
  },
  terroristIconContainer: {
    backgroundColor: "rgba(17,24,39,0.25)",
  },
  counterIconContainer: {
    backgroundColor: "rgba(17,24,39,0.28)",
  },
  buttonRow: {
    flexDirection: "column",
    gap: 8,
    width: 96,
    marginLeft: 6,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  classButton: {
    backgroundColor: "#2563EB",
  },
  disableButton: {
    backgroundColor: "#CA8A04",
  },
  deleteButton: {
    backgroundColor: "#DC2626",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: APP_FONT_FAMILY,
  },
});
