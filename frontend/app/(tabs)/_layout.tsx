import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false, // hide the default header
      tabBarStyle: { display: 'none' } // hide the default tab bar
    }}>
      <Tabs.Screen name="index" />
    </Tabs>
  );
}