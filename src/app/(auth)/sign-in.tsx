import { router } from "expo-router";
import { Button, Text, View } from "react-native";

const Signin = () => {
  return (
    <View>
      <Text>Sign in</Text>
      <Button title="Sign up" onPress={() => router.push("/sign-up")} />
    </View>
  );
};

export default Signin;
