import { Tabs } from "expo-router";
import React from "react";

import FloatingTabBar from "@/components/FloatingTabBar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state }) => {
        const routeName = state.routes[state.index]?.name;
        const map: Record<string, any> = {
          home: "home",
          offers: "offers",
          bookings: "bookings",
          chat: "chat",
          profile: "profile",
        };
        return <FloatingTabBar active={map[routeName] ?? null} />;
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="offers" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="placeholder" options={{ href: null }} />
    </Tabs>
  );
}
