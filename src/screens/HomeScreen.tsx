import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddNewPlayer from "../components/AddNewPlayer";
import PlayerCard from "../components/PlayerCard";
import PlayerType from "../types/playerType";
import PlayerClassType from "../types/playerClassType";
import { CLASS_CONFIG } from "../config/classConfig";
import balanceTeams from "../utils/balanceTeams";

const STORAGE_KEY = "players";

export default function HomeScreen() {
  const [allPlayers, setAllPlayers] = useState<PlayerType[]>([]);
  const [terrorists, setTerrorists] = useState<PlayerType[]>([]);
  const [counterTerrorists, setCounterTerrorists] = useState<PlayerType[]>([]);
  const [isRandomized, setIsRandomized] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const sortedPlayers = useMemo(
    () =>
      [...allPlayers].sort((a, b) => {
        if (a.disabled === b.disabled) {
          return 0;
        }
        return a.disabled ? 1 : -1;
      }),
    [allPlayers],
  );

  useEffect(() => {
    const hydratePlayers = async () => {
      try {
        const playersJson = await AsyncStorage.getItem(STORAGE_KEY);
        if (playersJson) {
          const parsedPlayers = JSON.parse(playersJson) as PlayerType[];
          setAllPlayers(parsedPlayers);
        }
      } catch {
        Alert.alert("Storage error", "Failed to load saved players.");
      }
    };
    hydratePlayers();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allPlayers)).catch(() => {
      Alert.alert("Storage error", "Failed to save players.");
    });
  }, [allPlayers]);

  const enabledPlayersCount = allPlayers.filter((player) => !player.disabled).length;

  const getTeamPoints = (players: PlayerType[]) =>
    players.reduce((sum, player) => sum + CLASS_CONFIG[player.class].points, 0).toFixed(1);

  const onCreateTeams = () => {
    const result = balanceTeams(allPlayers);
    setTerrorists(result.terrorists);
    setCounterTerrorists(result.counterTerrorists);
    setIsRandomized(true);
  };

  const onDeleteAll = () => {
    Alert.alert("Delete all", "Are you sure you want to delete all players?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setAllPlayers([]);
          setTerrorists([]);
          setCounterTerrorists([]);
          setIsRandomized(false);
          AsyncStorage.removeItem(STORAGE_KEY).catch(() => undefined);
        },
      },
    ]);
  };

  const onDeletePlayer = (playerId: string) => {
    setAllPlayers((state) => state.filter((player) => player.id !== playerId));
  };

  const onToggleClass = (playerId: string, newClass: PlayerClassType) => {
    setAllPlayers((state) =>
      state.map((player) => (player.id === playerId ? { ...player, class: newClass } : player)),
    );
  };

  const onToggleDisabled = (playerId: string) => {
    setAllPlayers((state) =>
      state.map((player) =>
        player.id === playerId ? { ...player, disabled: !player.disabled } : player,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      {!isRandomized ? (
        <>
          <View style={styles.topStats}>
            <Text style={styles.countText}>Players: {allPlayers.length}</Text>
            <Text style={styles.countText}>Enabled: {enabledPlayersCount}</Text>
          </View>
          {allPlayers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No players yet</Text>
              <Pressable style={styles.primaryButton} onPress={() => setShowAddModal(true)}>
                <Text style={styles.primaryButtonText}>Add new player</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={sortedPlayers}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <PlayerCard
                  player={item}
                  onDelete={onDeletePlayer}
                  onToggleClass={onToggleClass}
                  onToggleDisabled={onToggleDisabled}
                />
              )}
            />
          )}
          <View style={styles.footerButtons}>
            <Pressable style={styles.secondaryButton} onPress={() => setShowAddModal(true)}>
              <Text style={styles.buttonText}>ADD NEW</Text>
            </Pressable>
            <Pressable
              style={[styles.secondaryButton, enabledPlayersCount === 0 && styles.disabledButton]}
              onPress={onCreateTeams}
              disabled={enabledPlayersCount === 0}
            >
              <Text style={styles.buttonText}>CREATE TEAMS</Text>
            </Pressable>
            <Pressable
              style={[styles.secondaryButton, styles.deleteAllButton]}
              onPress={onDeleteAll}
              disabled={allPlayers.length === 0}
            >
              <Text style={styles.buttonText}>DELETE ALL</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <View style={styles.teamsContainer}>
          <View style={styles.teamColumn}>
            <Text style={styles.teamHeader}>Counter-Terrorists</Text>
            <Text style={styles.teamMeta}>
              {counterTerrorists.length} players / {getTeamPoints(counterTerrorists)} pts
            </Text>
            <FlatList
              data={counterTerrorists}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => <PlayerCard player={item} playerTeam="CT" disableActions />}
            />
          </View>
          <View style={styles.teamColumn}>
            <Text style={styles.teamHeader}>Terrorists</Text>
            <Text style={styles.teamMeta}>
              {terrorists.length} players / {getTeamPoints(terrorists)} pts
            </Text>
            <FlatList
              data={terrorists}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => <PlayerCard player={item} playerTeam="T" disableActions />}
            />
          </View>
          <Pressable style={styles.primaryButton} onPress={() => setIsRandomized(false)}>
            <Text style={styles.primaryButtonText}>Back to players</Text>
          </Pressable>
        </View>
      )}

      <AddNewPlayer
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddPlayer={(player) => setAllPlayers((state) => state.concat(player))}
        suggestedCount={allPlayers.length + 1}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#102238",
  },
  topStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  countText: {
    color: "#E5E7EB",
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
  emptyText: {
    color: "#E5E7EB",
    fontSize: 24,
    fontWeight: "700",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    padding: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#0284C7",
  },
  deleteAllButton: {
    backgroundColor: "#DC2626",
  },
  primaryButton: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0284C7",
  },
  disabledButton: {
    backgroundColor: "#475569",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
    textAlign: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  teamsContainer: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },
  teamColumn: {
    flex: 1,
    gap: 2,
  },
  teamHeader: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 16,
  },
  teamMeta: {
    color: "#C7D2FE",
    fontSize: 12,
    paddingHorizontal: 16,
  },
});
