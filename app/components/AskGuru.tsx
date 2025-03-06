import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

// WARNING: Exposing API keys in client-side code is not recommended for production apps
const GEMINI_API_KEY = 'AIzaSyBRxrAK8bI2aQzUSKHNq1HId9OQqO8Hv2M';

export default function AskGuru() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        {
          contents: [{
            parts: [{
              text: `You are an IPL expert. Answer the following question about IPL: ${question}`
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY
          }
        }
      );

      const generatedAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(generatedAnswer);
    } catch (error) {
      console.error('Error fetching answer:', error);
      setAnswer("Sorry, I couldn't get an answer at this time.");
    }
    setLoading(false);
  };

  const formatAnswer = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('*') || line.startsWith('#')) {
        return <Text key={index} style={styles.header}>{line.replace(/[*#]/g, '').trim()}</Text>;
      }
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        return (
          <View key={index} style={styles.statContainer}>
            <Text style={styles.statKey}>{key.trim()}:</Text>
            <Text style={styles.statValue}>{value.trim()}</Text>
          </View>
        );
      }
      return <Text key={index} style={styles.text}>{line.trim()}</Text>;
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ask the IPL Guru</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={question}
          onChangeText={setQuestion}
          placeholder="Ask about IPL..."
          multiline
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <FontAwesome name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      
      {answer && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerTitle}>Answer:</Text>
          <View style={styles.answerContent}>{formatAnswer(answer)}</View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E3F2FD', // Light blue background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1565C0', // Darker blue for title
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#90CAF9', // Light blue border
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1E88E5', // Blue button
    padding: 12,
    borderRadius: 25,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  answerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderColor: '#64B5F6', // Light blue border
    borderWidth: 1,
  },
  answerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1976D2', // Blue for answer title
  },
  answerContent: {
    marginTop: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    color: '#0D47A1', // Dark blue for headers
  },
  statContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  statKey: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#1565C0', // Blue for stat keys
  },
  statValue: {
    flex: 1,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    lineHeight: 22,
  },
});
