import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import matchesData from '../data/matches.json';
import playersData from '../data/players.json';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your navigation param list
type RootStackParamList = {
  TeamComparison: { team1: string; team2: string };
  Result: {
    batting_team: string;
    bowling_team: string;
    batting_prob: number;
    bowling_prob: number;
    batting_impact: number;
    bowling_impact: number;
  };
};

// Define the navigation prop type
type NavigationProp = StackNavigationProp<RootStackParamList, 'TeamComparison' | 'Result'>;

interface MatchItem {
  type: string;
  team1: string;
  team2: string;
  date?: string;
  time?: string;
  venue?: string;
  Player?: string;
  'Total MVP'?: number;
  title?: string;
  matches?: number;
  team1Wins?: number;
  team2Wins?: number;
  ties?: number;
  style?: any;
  onPress?: () => void;
  prediction?: string;
}

interface DateItem {
  type: 'date';
  date: string;
}

const UpcomingMatchesScreen = () => {
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  // Add this new function for match prediction
  const predictMatch = (team1: string, team2: string, headToHead: any) => {
    const totalMatches = headToHead.matches;
    const team1WinRate = headToHead.team1Wins / totalMatches;
    const team2WinRate = headToHead.team2Wins / totalMatches;
    
    let prediction;
    if (team1WinRate > team2WinRate) {
      prediction = `${team1} is likely to win (${(team1WinRate * 100).toFixed(2)}% chance)`;
    } else if (team2WinRate > team1WinRate) {
      prediction = `${team2} is likely to win (${(team2WinRate * 100).toFixed(2)}% chance)`;
    } else {
      prediction = "It's too close to call! Both teams have equal chances.";
    }
    
    return prediction;
  };

  const renderItem = ({ item }: { item: MatchItem | DateItem }) => {
    if (item.type === 'match') {
      return (
        <TouchableOpacity
          style={[styles.matchItem, (item as MatchItem).style]}
          onPress={() => {
            setSelectedMatch(item as MatchItem);
            setModalVisible(true);
          }}
        >
          <Text style={styles.matchText}>{`${(item as MatchItem).team1} vs ${(item as MatchItem).team2}`}</Text>
          <Text style={styles.dateText}>{`${(item as MatchItem).date} ${(item as MatchItem).time}`}</Text>
          <Text>{(item as MatchItem).venue}</Text>
        </TouchableOpacity>
      );
    } else if (item.type === 'date') {
      return <Text style={styles.dateHeader}>{item.date}</Text>;
    } else if (item.type === 'header') {
      return <Text style={styles.modalHeader}>{item.title}</Text>;
    } else if (item.type === 'headToHead') {
      return (
        <View style={styles.headToHead}>
          <Text>Matches: {item.matches}</Text>
          <Text>{item.team1} Wins: {item.team1Wins}</Text>
          <Text>{item.team2} Wins: {item.team2Wins}</Text>
          <Text>Ties: {item.ties}</Text>
        </View>
      );
    } else if (item.type === 'player') {
      return (
        <View style={styles.playerItem}>
          <Text>{item.Player}</Text>
          <Text>Total MVP: {item['Total MVP']}</Text>
        </View>
      );
    } else if (item.type === 'button') {
      return (
        <TouchableOpacity 
          style={[styles.buttonContainer, item.style && styles[item.style as keyof typeof styles] as ViewStyle]}
          onPress={item.onPress}
        >
          <Text style={styles.buttonText}>{item.title}</Text>
        </TouchableOpacity>
      );
    } else if (item.type === 'prediction') {
      return (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionText}>{item.prediction}</Text>
        </View>
      );
    }
    return null;
  };

  const getModalData = (): MatchItem[] => {
    if (!selectedMatch) return [];

    const headToHead = matchesData.headToHeadResults.find(
      h => (h.team1 === selectedMatch.team1 && h.team2 === selectedMatch.team2) ||
           (h.team1 === selectedMatch.team2 && h.team2 === selectedMatch.team1)
    );

    const topPlayers = playersData
      .filter(player => player.Team === selectedMatch.team1 || player.Team === selectedMatch.team2)
      .sort((a, b) => b['Total MVP'] - a['Total MVP'])
      .slice(0, 10)
      .map(player => ({ ...player, type: 'player' }));

    // Add prediction based on head-to-head
    const prediction = headToHead ? predictMatch(selectedMatch.team1, selectedMatch.team2, headToHead) : "Not enough data for prediction";

    return [
      { type: 'header', title: `${selectedMatch.team1} vs ${selectedMatch.team2}` },
      headToHead ? { ...headToHead, type: 'headToHead' } : null,
      { type: 'header', title: 'Match Prediction' },
      { type: 'prediction', prediction },
      { type: 'header', title: 'Top Players' },
      ...topPlayers,
      {
        type: 'button',
        title: 'Full Team Analysis',
        style: 'analysisButton',
        onPress: () => {
          setModalVisible(false);
          router.push({
            pathname: '/team-comparison',
            params: { team1: selectedMatch.team1, team2: selectedMatch.team2 }
          });
        }
      },
      {
        type: 'button',
        title: 'Close',
        style: 'closeButton',
        onPress: () => setModalVisible(false)
      }
    ].filter(Boolean) as MatchItem[];
  };

  const data: (MatchItem | DateItem)[] = modalVisible 
    ? getModalData() 
    : matchesData.upcomingMatches.map(match => ({ ...match, type: 'match' } as MatchItem));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Matches</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <FlatList
            data={getModalData()}
            renderItem={renderItem}
            keyExtractor={(item, index) => `modal-${item.type}-${index}`}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  matchItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  matchText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    color: 'gray',
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  headToHead: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  analysisButton: {
    backgroundColor: '#4CAF50',
    marginTop:42,
  },
  closeButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonContainer: {
    padding: 9,
    borderRadius: 12,
    marginTop: 7,
    marginBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Add these new styles for the prediction
  predictionContainer: {
    backgroundColor: '#e6f7ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  predictionText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});export default UpcomingMatchesScreen;