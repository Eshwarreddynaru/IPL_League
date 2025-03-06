import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import playersData from './data/players.json';
import { RouteProp } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

interface RouteParams {
  team1: string;
  team2: string;
}

interface TeamStats {
  totalMVP: number;
  avgMVP: number;
  topPlayer: Player | null;
}

interface Player {
  Player: string;
  Team: string;
  'Total MVP': number;
  // Add other properties as needed
}

type TeamComparisonParams = {
  team1: string;
  team2: string;
};

export default function TeamComparison() {
  const params = useLocalSearchParams();

  // Use optional chaining and ensure string type
  const team1 = Array.isArray(params.team1) ? params.team1[0] : params.team1 ?? '';
  const team2 = Array.isArray(params.team2) ? params.team2[0] : params.team2 ?? '';

  const getTeamStats = (teamName: string): TeamStats => {
    const teamPlayers = playersData.filter(player => player.Team === teamName);
    if (teamPlayers.length === 0) {
      return { totalMVP: 0, avgMVP: 0, topPlayer: null };
    }
    const totalMVP = teamPlayers.reduce((sum, player) => sum + (player['Total MVP'] || 0), 0);
    const avgMVP = totalMVP / teamPlayers.length;
    const topPlayer = teamPlayers.reduce((top, player) => 
      (player['Total MVP'] || 0) > (top['Total MVP'] || 0) ? player : top, teamPlayers[0]);

    return { totalMVP, avgMVP, topPlayer };
  };

  const team1Stats = useMemo(() => getTeamStats(team1), [team1]);
  const team2Stats = useMemo(() => getTeamStats(team2), [team2]);

  const renderPlayerItem = ({ item }: { item: Player }) => (
    <View style={styles.playerItem}>
      <Text style={styles.playerName}>{item.Player}</Text>
      <Text style={styles.playerStats}>Total MVP: {item['Total MVP'] || 0}</Text>
    </View>
  );

  const renderTeamColumn = (teamName: string, stats: TeamStats) => (
    <View style={styles.teamColumn}>
      <Text style={styles.teamName}>{teamName}</Text>
      <Text>Total MVP: {stats.totalMVP.toFixed(2)}</Text>
      <Text>Average MVP: {stats.avgMVP.toFixed(2)}</Text>
      <Text>Top Player: {stats.topPlayer ? stats.topPlayer.Player : 'N/A'}</Text>
    </View>
  );

  const teamPlayers = useMemo(() => {
    const team1Players = playersData.filter(player => player.Team === team1)
      .sort((a, b) => (b['Total MVP'] || 0) - (a['Total MVP'] || 0));
    const team2Players = playersData.filter(player => player.Team === team2)
      .sort((a, b) => (b['Total MVP'] || 0) - (a['Total MVP'] || 0));
    return [...team1Players, ...team2Players];
  }, [team1, team2]);

  return (
    <View style={styles.container}>
      <View style={styles.comparisonContainer}>
        {renderTeamColumn(team1, team1Stats)}
        {renderTeamColumn(team2, team2Stats)}
      </View>
      <Text style={styles.sectionTitle}>All Players</Text>
      <FlatList
        data={teamPlayers}
        renderItem={renderPlayerItem}
        keyExtractor={(item) => item.Player}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  teamColumn: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playerName: {
    fontSize: 16,
  },
  playerStats: {
    fontSize: 14,
    color: '#666',
  },
});