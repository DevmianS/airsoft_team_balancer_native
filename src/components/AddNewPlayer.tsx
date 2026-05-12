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
import ClassIcon from "./ClassIcon";
import { APP_FONT_FAMILY } from "../config/fonts";

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
          <Text style={styles.title}>ADD NEW PLAYER</Text>
          <Text style={styles.subtitle}>Choose class and optional nickname</Text>
          <View style={styles.classesWrap}>
            {Object.values(PlayerClassType).map((classType) => {
              const selected = selectedClass === classType;
              return (
                <Pressable
                  key={classType}
                  style={[styles.classButton, selected && styles.selectedClassButton]}
                  onPress={() => setSelectedClass(classType)}
                >
                  <View style={styles.classIconWrap}>
                    <ClassIcon classType={classType} size={36} />
                  </View>
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
    borderRadius: 16,
    backgroundColor: "#1F2937",
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  title: {
    color: "#F9FAFB",
    fontSize: 20,
    letterSpacing: 0.5,
    fontFamily: APP_FONT_FAMILY,
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: -4,
    fontFamily: APP_FONT_FAMILY,
  },
  classesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  classButton: {
    width: "48%",
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: "#374151",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedClassButton: {
    backgroundColor: "#0C4A6E",
    borderColor: "#38BDF8",
  },
  classIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  classText: {
    color: "#E5E7EB",
    fontSize: 12,
    fontFamily: APP_FONT_FAMILY,
  },
  input: {
    borderRadius: 12,
    backgroundColor: "#4B5563",
    color: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 17,
    fontFamily: APP_FONT_FAMILY,
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
    fontFamily: APP_FONT_FAMILY,
  },
});
