import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const navigateToAskGuru = () => {
    router.push('/askguru');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to IPL League Analysis</Text>
      <Text style={styles.subtitle}>Explore, Predict, and Analyze IPL Matches</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/predict')}
        >
          <Text style={styles.buttonText}>Predict Match</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/players')}
        >
          <Text style={styles.buttonText}>Player Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/matches')}
        >
          <Text style={styles.buttonText}>Upcoming Matches</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.askGuruButton} onPress={navigateToAskGuru}>
        <FontAwesome name="question-circle" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Ask the IPL Guru</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#0d1f82',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  askGuruButton: {
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
});
