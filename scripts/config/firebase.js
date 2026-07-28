import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Импортируем Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDnoZa72N-WLg_YWM88GmlpBcsxtA6aW5k",
  authDomain: "randevu-b6b2e.firebaseapp.com",
  projectId: "randevu-b6b2e",
  storageBucket: "randevu-b6b2e.firebasestorage.app",
  messagingSenderId: "739396749169",
  appId: "1:739396749169:web:2e811dd997804b4313d8d0",
  measurementId: "G-KELK8XNVCS"
};

// Инициализируем сервисы Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Создаем экземпляр базы данных

// Экспортируем их, чтобы feed.js и main.js могли их импортировать
export { app, analytics, auth, db };
