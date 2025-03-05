import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "lpchatsystem.firebaseapp.com",
  projectId: "lpchatsystem",
  storageBucket: "lpchatsystem.firebasestorage.app",
  messagingSenderId: "172981462663",
  appId: "1:172981462663:web:5c90457a736d89433ffa22",
  measurementId: "G-3H0PQJDY8V"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()