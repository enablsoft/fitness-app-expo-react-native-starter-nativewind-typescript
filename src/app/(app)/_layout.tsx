import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router"
import { ActivityIndicator, View } from "react-native";

const Layout = () => {
  const {isLoaded, isSignedIn, userId, sessionId, getToken} = useAuth();
  console.log("isSignedIn >>>",isSignedIn)

  const safeIsSignedIn = isSignedIn === undefined ? false : isSignedIn;

  if(!isLoaded){
    return (
      <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000ff" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="sign-in" options={{headerShown: false}} />
        <Stack.Screen name="sign-up" options={{headerShown: false}} />
      </Stack.Protected> 
    </Stack>
  )
}

export default Layout;