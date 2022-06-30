import React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  update,
} from "firebase/database";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPW, setConfirmPW] = useState("");
  const [userName, setUserName] = useState("");
  const [pageSetting, setPageSetting] = useState("Login");
  const db = getDatabase();
  const [isNewUser, setIsNewUser] = useState(false);

  const register = () => {
    createUserWithEmailAndPassword(props.userAuth, email, password);
    setIsNewUser(true);
    //  console.log(props.userId);
    // const userListRef = ref(db, "users/" + userName);
    // update(userListRef, {
    //   pushToken: "",
    // });
  };

  const login = () => {
    signInWithEmailAndPassword(props.userAuth, email, password);
    //console.log(props.userId);
  };

  const submit = () => {
    if (pageSetting === "Login") {
      login();
      // console.log(props.userId);
    } else if (pageSetting === "Register") {
      register();
      //
    }
  };
  // useEffect(async () => {
  //   //return setIsNewUser(false);
  // }, [isFocused]);
  useEffect(() => {
    if (props.userId !== "") {
      props.navigation.navigate("Home", {
        userName: userName,
        isNewUser: isNewUser,
      });
    } else {
      setEmail("");
      setPassword("");
      setUserName("");
      setConfirmPW("");
      setPageSetting("Login");
      setIsNewUser(false);
    }
  }, [props.userId]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {pageSetting === "Register" ? (
        <TextInput
          style={{ borderWidth: 1, marginBottom: 5, padding: 3, width: 150 }}
          placeholder="Username"
          onChangeText={setUserName}
          value={userName}
        />
      ) : null}
      <TextInput
        style={{ borderWidth: 1, marginBottom: 5, padding: 3, width: 150 }}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={{ borderWidth: 1, marginBottom: 5, padding: 3, width: 150 }}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      {pageSetting === "Register" ? (
        <TextInput
          style={{ borderWidth: 1, marginBottom: 5, padding: 3, width: 150 }}
          placeholder="Confirm Password"
          secureTextEntry={true}
          onChangeText={setConfirmPW}
          value={confirmPW}
        />
      ) : null}
      <TouchableOpacity onPress={submit}>
        <View
          style={{
            borderWidth: 1,
            width: 75,
            height: 25,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            backgroundColor: "blue",
          }}
        >
          {pageSetting === "Login" ? (
            <Text style={{ color: "white" }}>Login</Text>
          ) : (
            <Text style={{ color: "white" }}>Register</Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (pageSetting === "Login") setPageSetting("Register");
          else setPageSetting("Login");
        }}
      >
        {pageSetting === "Login" ? (
          <Text
            style={{
              textAlign: "center",
            }}
          >
            Don't have an account?{"\n"}Sign up
          </Text>
        ) : (
          <Text
            style={{
              textAlign: "center",
            }}
          >
            Already have an account?{"\n"}Login
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Login;
