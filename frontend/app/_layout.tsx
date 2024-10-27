import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="index" 
        options={{
          // Hide header for welcome screen
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="home" 
        options={{
          title: "Home",
          // Prevent going back to welcome screen
          headerBackVisible: false,
        }} 
      />
      <Stack.Screen 
        name="report" 
        options={{
          title: "Create Report"
        }} 
      />
    </Stack>
  );
}