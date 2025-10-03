import { View, Text, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

export default function ExerciseDetail() {
    const {id} = useLocalSearchParams<{
        id:string;
    }>();
  return (
    <SafeAreaView className='flex-1 bg-white pt-5'>
      <StatusBar barStyle='light-content' backgroundColor="#000" />
      <Text>ExerciseDetail: {id}</Text>
    </SafeAreaView>
  )
}