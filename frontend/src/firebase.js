// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGn2Le5d9Eq7Y9rE-7z4Sxnd1EJ6Wivb4",  // ← REPLACE WITH YOUR ACTUAL VALUES
  authDomain: "saradhi-info-29d46.firebaseapp.com",
  projectId: "saradhi-info-29d46",
  storageBucket: "saradhi-info-29d46.firebasestorage.app",
  messagingSenderId: "403145764012",
  appId: "1:403145764012:web:938d2dbf787ccb32504309"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
