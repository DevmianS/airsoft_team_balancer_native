import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { BlackOpsOne_400Regular } from "@expo-google-fonts/black-ops-one";
import HomeScreen from "./src/screens/HomeScreen";
import { APP_FONT_FAMILY } from "./src/config/fonts";

type RootStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#102238",
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    BlackOpsOne_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer theme={appTheme}>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#16375A" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontFamily: APP_FONT_FAMILY, fontSize: 22 },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "ASG Team Balancer" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
