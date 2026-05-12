import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import PlayerType from "../types/playerType";
import PlayerClassType from "../types/playerClassType";
import { CLASS_CONFIG } from "../config/classConfig";
import ClassSelectionModal from "./ClassSelectionModal";

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

  const getPlayerIcon = () => {
    const config = CLASS_CONFIG[player.class];
    if (playerTeam === "T" && config.terroristIcon) {
      return config.terroristIcon;
    }
    return config.icon;
  };

  const teamStyles = playerTeam === "T" ? styles.terroristCard : playerTeam === "CT" ? styles.counterCard : null;

  return (
    <>
      <Pressable
        style={[styles.card, teamStyles, player.disabled && styles.disabledCard]}
        onPress={() => {
          if (!playerTeam && !disableActions) {
            setShowModifyButtons((state) => !state);
          }
        }}
      >
        <View style={styles.mainRow}>
          <Text numberOfLines={1} style={styles.playerName}>
            {player.name.toUpperCase()}
          </Text>
          <Text style={styles.playerIcon}>{getPlayerIcon()}</Text>
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
    borderRadius: 12,
    backgroundColor: "#374151",
    padding: 12,
    width: "100%",
    gap: 8,
  },
  terroristCard: {
    backgroundColor: "#8D6246",
  },
  counterCard: {
    backgroundColor: "#2D7AA9",
  },
  disabledCard: {
    opacity: 0.45,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  playerName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },
  playerIcon: {
    fontSize: 30,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
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
    fontWeight: "700",
    fontSize: 12,
  },
});
