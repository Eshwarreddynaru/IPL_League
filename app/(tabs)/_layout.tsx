import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Home",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="predict" 
        options={{ 
          title: "Predict",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="players" 
        options={{ 
          title: "Players",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="matches" 
        options={{ 
          title: "Matches",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="football-outline" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen
        name="askguru"
        options={{
          title: 'Ask Guru',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="question-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
