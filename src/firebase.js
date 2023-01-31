import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getStorage, ref, uploadString } from "firebase/storage";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBSYpF44goiGC2PBR9R71pS9MEc9aCT_n0",
  authDomain: "temich-app-chat.firebaseapp.com",
  projectId: "temich-app-chat",
  storageBucket: "temich-app-chat.appspot.com",
  messagingSenderId: "373927688798",
  appId: "1:373927688798:web:8bcf34a83956c96bd352cf"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();