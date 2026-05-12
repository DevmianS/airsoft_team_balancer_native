import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PlayerClassType from "../types/playerClassType";
import { CLASS_CONFIG } from "../config/classConfig";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (classType: PlayerClassType) => void;
  currentClass: PlayerClassType;
}

export default function ClassSelectionModal({
  isOpen,
  onClose,
  onSelect,
  currentClass,
}: Props) {
  return (
    <Modal transparent visible={isOpen} onRequestClose={onClose} animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.title}>Select class</Text>
          <View style={styles.grid}>
            {Object.values(PlayerClassType).map((classType) => {
              const selected = currentClass === classType;
              return (
                <Pressable
                  key={classType}
                  style={[styles.classButton, selected && styles.classButtonSelected]}
                  onPress={() => {
                    onSelect(classType);
                    onClose();
                  }}
                >
                  <Text style={styles.classIcon}>{CLASS_CONFIG[classType].icon}</Text>
                  <Text style={styles.classLabel}>{classType}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    borderRadius: 14,
    backgroundColor: "#1F2937",
    padding: 16,
    gap: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  classButton: {
    width: "48%",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#374151",
    gap: 6,
  },
  classButtonSelected: {
    backgroundColor: "#0369A1",
  },
  classIcon: {
    fontSize: 34,
  },
  classLabel: {
    color: "#E5E7EB",
    fontWeight: "600",
  },
});
