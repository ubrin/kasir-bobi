
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "kasir-bob-okq4b.firebaseapp.com",
  projectId: "kasir-bob-okq4b",
  storageBucket: "kasir-bob-okq4b.appspot.com",
  messagingSenderId: "1071465538419",
  appId: "1:1071465538419:web:9c50c1f54c9c18d18b5327",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
