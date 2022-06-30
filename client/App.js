import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./Screens/Login";
import Home from "./Screens/Home";

const Stack = createNativeStackNavigator();

function App() {
  const [userId, setUserId] = useState("");

  const userAuth = getAuth();

  useEffect(() => {
    onAuthStateChanged(userAuth, (user) => {
      if (user !== null) {
        setUserId(user.uid);
      } else {
        setUserId("");
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => (
            <Login {...props} userAuth={userAuth} userId={userId}></Login>
          )}
        </Stack.Screen>
        <Stack.Screen name="Home">
          {(props) => (
            <Home userAuth={userAuth} userId={userId} {...props}></Home>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
