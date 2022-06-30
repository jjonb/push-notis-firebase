// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";

import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoRK9j-vyII9yWtsXuM25OYHM7wQUqSoo",
  authDomain: "push-notis-firebase.firebaseapp.com",
  projectId: "push-notis-firebase",
  storageBucket: "push-notis-firebase.appspot.com",
  messagingSenderId: "247311208870",
  appId: "1:247311208870:web:f528e5d2be8467e904ff67",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initialize auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
