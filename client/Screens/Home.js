import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import axios from "axios";

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Platform,
  TouchableOpacity,
} from "react-native";
//import Home from "./Pages/Home";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  update,
} from "firebase/database";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Home = (props) => {
  let UrlString = "localhost";

  if (Platform.OS == "android") {
    UrlString = "10.0.2.2";
  }
  const userName = props.route.params.userName;
  const isNewUser = props.route.params.isNewUser;
  //console.log(userName);
  const [users, setUsers] = useState([]);
  const [picked, setPicked] = useState("");
  const [pickedToken, setPickedToken] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();
  const db = getDatabase();
  const usersRef = ref(db, "users/");
  const userRef = ref(db, "users/" + userName);
  if (isNewUser) {
    update(userRef, { userName: userName });
  }
  //const newPushToken = push(usersRef);
  //console.log(props.userId);
  useEffect(() => {
    return onValue(usersRef, (snapshot) => {
      if (snapshot.val() !== null) {
        const data = snapshot.val();
        //console.log(data);
        let result = Object.keys(data).map((key) => {
          return { userName: key, id: key, pushToken: data[key].pushToken }; //{ task: data[key].task, id: key };
        });
        //console.log(result);
        setUsers(result);
      } else {
        setUsers([]);
      }
    });
  }, []);

  useEffect(() => {
    if (Device.isDevice) {
      registerForPushNotificationsAsync().then((token) => {
        //setExpoPushToken(token);
        //console.log(expoPushToken);
        update(userRef, { pushToken: token });
      });
    }
  }, []);
  console.log(pickedToken);
  const sendPush = async () => {
    await axios
      .post(`http://${UrlString}:5000/notify/notification`, {
        pushToken: pickedToken,
        title: title,
        text: text,
      })
      .then((response) => console.log(response))
      .then(alert("Notification sent to " + picked))
      .catch((e) => console.log(e));
  };
  const signOut = () => {
    props.userAuth.signOut();
    props.navigation.navigate("Login");
  };
  return (
    <View style={{ flex: 1, alignItems: "center", padding: 20 }}>
      <View>
        <Text style={{ fontSize: 15 }}>Welcome back!</Text>
      </View>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 5, padding: 3, width: 150 }}
        placeholder="Title"
        onChangeText={setTitle}
        value={title}
      />
      <TextInput
        style={{
          borderWidth: 1,
          marginBottom: 5,
          padding: 3,
          width: 150,
          textAlignVertical: "top",
        }}
        placeholder="Text"
        onChangeText={setText}
        value={text}
        multiline={true}
        numberOfLines={4}
      />
      <FlatList
        data={users}
        style={{ flexGrow: 0 }}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 5,
              width: 80,
              borderRadius: 10,
              alignItems: "center",
              borderColor: "green",
              borderWidth: item.userName === picked ? 3 : 0,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                item.userName === picked
                  ? (setPicked(""), setPickedToken(""))
                  : (setPicked(item.userName), setPickedToken(item.pushToken))
              }
            >
              <Text style={{ color: "blue" }}>{item.userName}</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <View
        style={{
          backgroundColor: "green",
          width: 80,
          alignItems: "center",
          borderRadius: 10,
          marginBottom: 5,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={sendPush}>
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: "red",
          width: 80,
          alignItems: "center",
          borderRadius: 10,
          marginBottom: 5,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={signOut}>
          <Text style={{ color: "white" }}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    //alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
