import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image } from 'react-native';
import playersData from '../data/players.json';

// Update the Player interface
interface Player {
  Player: string;
  Team: string;
  Rank: number;
  'Total MVP': number;
  // 'Batting MVP': number;
  // 'Bowling MVP': number;
  'Photo URL': string;
}

export default function PlayerAnalysisScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setPlayers(playersData as Player[]);
  }, []);

  const filteredPlayers = players.filter(player =>
    player.Player.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update the renderItem function
  const renderPlayerItem = ({ item }: { item: Player }) => (
    <View style={styles.playerCard}>
      <Image source={{ uri: item['Photo URL'] }} style={styles.playerImage} />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.Player}</Text>
        <Text style={styles.playerTeam}>{item.Team}</Text>
        <Text>Rank: {item.Rank}</Text>
        <Text>Total MVP: {item['Total MVP']}</Text>
        {/* <Text>Batting MVP: {item['Batting MVP']}</Text>
        <Text>Bowling MVP: {item['Bowling MVP']}</Text> */}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search players..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredPlayers}
        renderItem={renderPlayerItem}
        keyExtractor={(item) => item.Rank.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  playerCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  playerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerTeam: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
});
