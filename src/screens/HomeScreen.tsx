import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddNewPlayer from "../components/AddNewPlayer";
import PlayerCard from "../components/PlayerCard";
import PlayerType from "../types/playerType";
import PlayerClassType from "../types/playerClassType";
import { CLASS_CONFIG } from "../config/classConfig";
import { APP_FONT_FAMILY } from "../config/fonts";
import balanceTeams from "../utils/balanceTeams";

const STORAGE_KEY = "players";
const TEAM_ICON_SOURCE = {
  CT: require("../../assets/icons/counterterrorists.webp"),
  T: require("../../assets/icons/terrorists.webp"),
} as const;

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
      <View style={styles.container}>
        {!isRandomized ? (
          <>
            {allPlayers.length > 0 && (
              <View style={styles.playersCounterBadge}>
                <Text style={styles.playersCounterValue}>{allPlayers.length}</Text>
              </View>
            )}

            {allPlayers.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Press ADD NEW to add new players</Text>
              </View>
            ) : (
              <FlatList
                data={sortedPlayers}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.playersListContainer}
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

            {allPlayers.length > 0 && (
              <Pressable style={styles.deleteAllFab} onPress={onDeleteAll}>
                <View style={styles.fabContent}>
                  <MaterialIcons name="delete-forever" size={22} color="#FFFFFF" />
                  <Text style={styles.fabLabel}>DELETE ALL</Text>
                </View>
              </Pressable>
            )}

            {enabledPlayersCount > 0 && allPlayers.length > 1 && (
              <Pressable style={[styles.mainFab, styles.createTeamsFab]} onPress={onCreateTeams}>
                <View style={styles.fabContent}>
                  <MaterialIcons name="shuffle" size={20} color="#FFFFFF" />
                  <Text style={styles.fabLabel}>CREATE TEAMS</Text>
                </View>
              </Pressable>
            )}

            <Pressable style={[styles.mainFab, styles.addPlayerFab]} onPress={() => setShowAddModal(true)}>
              <View style={styles.fabContent}>
                <MaterialIcons name="person-add" size={20} color="#FFFFFF" />
                <Text style={styles.fabLabel}>ADD NEW</Text>
              </View>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.teamsSplit}>
              <View style={[styles.teamColumn, styles.counterColumn]}>
                <View style={styles.teamHeaderWrap}>
                  <Image source={TEAM_ICON_SOURCE.CT} style={styles.teamLogo} resizeMode="contain" />
                  <Text style={styles.teamHeader}>Counter-Terrorists</Text>
                </View>
                <Text style={styles.teamMeta}>
                  {counterTerrorists.length} players / {getTeamPoints(counterTerrorists)} pts
                </Text>
                <FlatList
                  data={counterTerrorists}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.teamListContainer}
                  renderItem={({ item }) => <PlayerCard player={item} playerTeam="CT" disableActions />}
                />
              </View>

              <View style={[styles.teamColumn, styles.terrorColumn]}>
                <View style={styles.teamHeaderWrap}>
                  <Image source={TEAM_ICON_SOURCE.T} style={styles.teamLogo} resizeMode="contain" />
                  <Text style={styles.teamHeader}>Terrorists</Text>
                </View>
                <Text style={styles.teamMeta}>
                  {terrorists.length} players / {getTeamPoints(terrorists)} pts
                </Text>
                <FlatList
                  data={terrorists}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.teamListContainer}
                  renderItem={({ item }) => <PlayerCard player={item} playerTeam="T" disableActions />}
                />
              </View>
            </View>

            <Pressable style={[styles.mainFab, styles.playersFab]} onPress={() => setIsRandomized(false)}>
              <View style={styles.fabContent}>
                <MaterialIcons name="groups" size={20} color="#FFFFFF" />
                <Text style={styles.fabLabel}>PLAYERS</Text>
              </View>
            </Pressable>
          </>
        )}
      </View>

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
  container: {
    flex: 1,
  },
  playersCounterBadge: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    minWidth: 64,
    height: 34,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#0284C7",
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  playersCounterValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: APP_FONT_FAMILY,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  emptyText: {
    color: "#E5E7EB",
    fontSize: 28,
    textAlign: "center",
    fontFamily: APP_FONT_FAMILY,
  },
  playersListContainer: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 180,
    gap: 10,
  },
  mainFab: {
    position: "absolute",
    bottom: 20,
    width: 92,
    minHeight: 64,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  addPlayerFab: {
    right: 14,
    backgroundColor: "#0284C7",
    borderColor: "#38BDF8",
  },
  createTeamsFab: {
    left: 14,
    backgroundColor: "#0284C7",
    borderColor: "#38BDF8",
  },
  deleteAllFab: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    minWidth: 110,
    minHeight: 62,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "#DC2626",
    borderWidth: 1,
    borderColor: "#F87171",
  },
  playersFab: {
    right: 14,
    backgroundColor: "#0284C7",
    borderColor: "#38BDF8",
  },
  fabLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    letterSpacing: 0.5,
    textAlign: "center",
    fontFamily: APP_FONT_FAMILY,
  },
  fabContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  teamsSplit: {
    flex: 1,
    flexDirection: "row",
    paddingBottom: 100,
  },
  teamColumn: {
    flex: 1,
    gap: 6,
    paddingTop: 10,
  },
  counterColumn: {
    backgroundColor: "#16375A",
  },
  terrorColumn: {
    backgroundColor: "#6B4A36",
  },
  teamHeaderWrap: {
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "rgba(17,24,39,0.32)",
  },
  teamLogo: {
    width: 22,
    height: 22,
  },
  teamHeader: {
    color: "#FFFFFF",
    fontSize: 13,
    textTransform: "uppercase",
    fontFamily: APP_FONT_FAMILY,
  },
  teamMeta: {
    color: "#DBEAFE",
    fontSize: 11,
    textAlign: "center",
    fontFamily: APP_FONT_FAMILY,
  },
  teamListContainer: {
    paddingHorizontal: 8,
    paddingBottom: 20,
    gap: 8,
  },
});
