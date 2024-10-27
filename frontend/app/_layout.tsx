import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // Add animation
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="home" 
        options={{
          headerShown: true,
          title: "Home",
          headerBackVisible: true, // Enable back button
          gestureEnabled: true, // Enable swipe back gesture
        }} 
      />
      <Stack.Screen 
        name="report" 
        options={{
          headerShown: true,
          title: "Create Report",
          animation: 'slide_from_right',
        }} 
      />
    </Stack>
  );
}