import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function Page() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {text: "Cancel", style: "cancel"},
      {text: "Sign Out", style: "destructive", onPress: async () => {
        await signOut();
      }}
    ]);
  }
  return (
    <SafeAreaView className="flex flex-1 mt-5">
      <Text>Profile</Text>

      {/**Sign out */}
      <View className="px-6 mb-8">
        <TouchableOpacity 
          onPress={handleSignOut}
          className="bg-red-600 rounded-2xl p-4 shadow-sm"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={20} color="white"/>
            <Text className="text-white font-semibold text-lg ml-2">
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
