import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="result" options={{ title: "Prediction Result" }} />
      <Stack.Screen name="team-comparison" options={{ title: "Team Comparison" }} />
    </Stack>
  );
}
