import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import useAuthStore from "../../store/auth.store";
import "./global.css";

Sentry.init({
  dsn: "https://c16ee01b9123050a06d4d0a996aea2c3@o4510556767453184.ingest.us.sentry.io/4512151532535808",
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

function RootLayout() {
  const { isLoading, isAuthenticated, fetchAuthUser } = useAuthStore();

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require("../../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Medium": require("../../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Regular": require("../../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-SemiBold": require("../../assets/fonts/Quicksand-SemiBold.ttf"),
    "QuickSand-Light": require("../../assets/fonts/Quicksand-Light.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    fetchAuthUser();
  }, []);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

export default Sentry.wrap(RootLayout);
