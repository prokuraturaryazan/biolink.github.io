import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ВСТАВЬ СВОЙ КОНФИГ СЮДА
const firebaseConfig = {
  apiKey: "AIzaSyDnoZa72N-WLg_YWM88GmlpBcsxtA6aW5k",
  authDomain: "randevu-b6b2e.firebaseapp.com",
  projectId: "randevu-b6b2e",
  storageBucket: "randevu-b6b2e.firebasestorage.app",
  messagingSenderId: "739396749169",
  appId: "1:739396749169:web:2e811dd997804b4313d8d0",
  measurementId: "G-KELK8XNVCS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);