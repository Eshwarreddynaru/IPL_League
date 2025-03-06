import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { useLocalSearchParams } from 'expo-router';

type ResultScreenParams = {
  batting_team: string;
  bowling_team: string;
  batting_prob: string;
  bowling_prob: string;
  batting_impact: string;
  bowling_impact: string;
};

const windowWidth = Dimensions.get('window').width;

export default function ResultScreen() {
  const params = useLocalSearchParams<ResultScreenParams>();

  // Use the correct parameter names as sent from the predict screen
  const battingTeam = params.batting_team || '';
  const bowlingTeam = params.bowling_team || '';
  const battingProb = parseFloat(params.batting_prob) || 0;
  const bowlingProb = parseFloat(params.bowling_prob) || 0;

  // Ensure valid numbers and normalize to percentages
  if (isNaN(battingProb) || isNaN(bowlingProb)) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Prediction Result</Text>
        <Text style={styles.text}>Invalid data provided.</Text>
      </View>
    );
  }

  const total = battingProb + bowlingProb;
  const normalizedBattingProb = (battingProb / total) * 100;
  const normalizedBowlingProb = (bowlingProb / total) * 100;

  // Ensure percentages add up to 100%
  const chartData = [normalizedBattingProb, normalizedBowlingProb];
  const chartColors = ['#4CAF50', '#F44336'];  // Green for batting team, Red for bowling team

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prediction Result</Text>
      <Text style={styles.text}>Batting Team: {battingTeam}</Text>
      <Text style={styles.text}>Bowling Team: {bowlingTeam}</Text>
      
      <View style={styles.chartContainer}>
        <PieChart
          widthAndHeight={windowWidth * 0.7}
          series={chartData}
          sliceColor={chartColors}
          coverRadius={0.45}
          coverFill={'#FFF'}
        />
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: chartColors[0] }]} />
          <Text style={styles.legendText}>{battingTeam} Win: {normalizedBattingProb.toFixed(2)}%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: chartColors[1] }]} />
          <Text style={styles.legendText}>{bowlingTeam} Win: {normalizedBowlingProb.toFixed(2)}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  chartContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  legendContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
  },
});