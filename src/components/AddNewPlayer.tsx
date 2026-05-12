import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import PlayerClassType from "../types/playerClassType";
import PlayerType from "../types/playerType";
import { CLASS_CONFIG } from "../config/classConfig";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddPlayer: (player: PlayerType) => void;
  suggestedCount: number;
}

export default function AddNewPlayer({
  visible,
  onClose,
  onAddPlayer,
  suggestedCount,
}: Props) {
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<PlayerClassType>(PlayerClassType.Rifleman);

  const addPlayerButtonHandler = () => {
    const trimmedName = name.trim();
    const newPlayer: PlayerType = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      name: trimmedName || `Player ${suggestedCount}`,
      class: selectedClass,
      disabled: false,
    };
    onAddPlayer(newPlayer);
    setName("");
    setSelectedClass(PlayerClassType.Rifleman);
    onClose();
  };

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="slide">
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.title}>Add new player</Text>
          <View style={styles.classesWrap}>
            {Object.values(PlayerClassType).map((classType) => {
              const selected = selectedClass === classType;
              return (
                <Pressable
                  key={classType}
                  style={[styles.classButton, selected && styles.selectedClassButton]}
                  onPress={() => setSelectedClass(classType)}
                >
                  <Text style={styles.classEmoji}>{CLASS_CONFIG[classType].icon}</Text>
                  <Text style={styles.classText}>{classType}</Text>
                </Pressable>
              );
            })}
          </View>
          <TextInput
            style={styles.input}
            placeholder={`Player ${suggestedCount}`}
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
          <View style={styles.actions}>
            <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.actionText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, styles.addButton]} onPress={addPlayerButtonHandler}>
              <Text style={styles.actionText}>Add</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 500,
    borderRadius: 14,
    backgroundColor: "#1F2937",
    padding: 16,
    gap: 14,
  },
  title: {
    color: "#F9FAFB",
    fontSize: 22,
    fontWeight: "700",
  },
  classesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  classButton: {
    width: "48%",
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: "#374151",
    alignItems: "center",
    gap: 4,
  },
  selectedClassButton: {
    backgroundColor: "#0284C7",
  },
  classEmoji: {
    fontSize: 28,
  },
  classText: {
    color: "#E5E7EB",
    fontWeight: "600",
    fontSize: 12,
  },
  input: {
    borderRadius: 10,
    backgroundColor: "#4B5563",
    color: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  actionButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  cancelButton: {
    backgroundColor: "#6B7280",
  },
  addButton: {
    backgroundColor: "#0284C7",
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
