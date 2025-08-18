// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDsxRDoEe0wWMoWSaM4xZfdh0nhiYPVDVM",
  authDomain: "chorechart-eb047.firebaseapp.com",
  projectId: "chorechart-eb047",
  storageBucket: "chorechart-eb047.firebasestorage.app",
  messagingSenderId: "906477813429",
  appId: "1:906477813429:web:93ab2e3a8fa42bbede88fc",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { db, messaging };
