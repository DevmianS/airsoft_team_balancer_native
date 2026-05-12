import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PlayerClassType from "../types/playerClassType";
import { APP_FONT_FAMILY } from "../config/fonts";
import ClassIcon from "./ClassIcon";

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
          <Text style={styles.title}>SELECT CLASS</Text>
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
                  <View style={styles.classIconWrap}>
                    <ClassIcon classType={classType} size={38} />
                  </View>
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
    borderRadius: 16,
    backgroundColor: "#1F2937",
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center",
    fontFamily: APP_FONT_FAMILY,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  classButton: {
    width: "48%",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#374151",
    gap: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  classButtonSelected: {
    backgroundColor: "#0C4A6E",
    borderColor: "#38BDF8",
  },
  classIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  classLabel: {
    color: "#E5E7EB",
    fontFamily: APP_FONT_FAMILY,
  },
});
