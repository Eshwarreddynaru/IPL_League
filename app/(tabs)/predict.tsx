import React, { useState, useEffect } from 'react';
import {Text, StyleSheet, ScrollView, TextInput, Button, View, TouchableOpacity, Linking } from 'react-native';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { getTeams, getVenues, getPrediction } from '../api/predictionApi';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [matchDetails, setMatchDetails] = useState<MatchDetails>({
    batting_team: '',
    bowling_team: '',
    venue: '',
    target: '',
    current_score: '',
    wickets_left: '',
    balls_left: '',
  });

  useEffect(() => {
    fetchTeamsAndVenues();
  }, []);

  const fetchTeamsAndVenues = async () => {
    try {
      const teamsData = await getTeams();
      const venuesData = await getVenues();
      setTeams(teamsData);
      setVenues(venuesData);
    } catch (error) {
      console.error('Error fetching teams and venues:', error);
    }
  };

  const handleInputChange = (name: keyof MatchDetails, value: string) => {
    setMatchDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const predictionData = {
        ...matchDetails,
        target: parseInt(matchDetails.target),
        current_score: parseInt(matchDetails.current_score),
        wickets_left: parseInt(matchDetails.wickets_left),
        balls_left: parseInt(matchDetails.balls_left)
      };
      const prediction = await getPrediction(predictionData);
      console.log('Prediction result:', JSON.stringify(prediction, null, 2));
      router.push({
        pathname: "/result",
        params: prediction
      });
    } catch (error) {
      console.error('Error getting prediction:', error);
      Alert.alert('Error', 'Failed to get prediction. Please try again.');
    }
  };

  const openStreamlitApp = async () => {
    const url = 'https://predection.streamlit.app/';
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open this URL: " + url);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Match Prediction</Text>
      <Picker
        selectedValue={matchDetails.batting_team}
        onValueChange={(value) => handleInputChange('batting_team', value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Batting Team" value="" />
        {teams.map((team) => (
          <Picker.Item key={team} label={team} value={team} />
        ))}
      </Picker>

      <Picker
        selectedValue={matchDetails.bowling_team}
        onValueChange={(value) => handleInputChange('bowling_team', value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Bowling Team" value="" />
        {teams.map((team) => (
          <Picker.Item key={team} label={team} value={team} />
        ))}
      </Picker>

      <Picker
        selectedValue={matchDetails.venue}
        onValueChange={(value) => handleInputChange('venue', value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Venue" value="" />
        {venues.map((venue) => (
          <Picker.Item key={venue} label={venue} value={venue} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Target"
        keyboardType="numeric"
        onChangeText={(text) => handleInputChange('target', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Current Score"
        keyboardType="numeric"
        onChangeText={(text) => handleInputChange('current_score', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Balls Left"
        keyboardType="numeric"
        onChangeText={(text) => handleInputChange('balls_left', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Wickets"
        keyboardType="numeric"
        onChangeText={(text) => handleInputChange('wickets_left', text)}
      />

      <Button title="Predict" onPress={handleSubmit} />
      <TouchableOpacity style={styles.streamlitButton} onPress={openStreamlitApp}>
        <FontAwesome name="external-link" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Open Streamlit Prediction</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

interface MatchDetails {
  batting_team: string;
  bowling_team: string;
  venue: string;
  target: string;
  current_score: string;
  wickets_left: string;
  balls_left: string;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  streamlitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
