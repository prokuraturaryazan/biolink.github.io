import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase.js';
import { state } from './core/state.js';
import { handleRoute } from './core/router.js';

onAuthStateChanged(auth, async (user) => {
  if (user) {
    state.user = user;
    const docSnap = await getDoc(doc(db, 'users', user.uid));
    if (docSnap.exists()) {
      state.profile = docSnap.data();
    }
  } else {
    state.user = null;
    state.profile = null;
  }
  handleRoute(); // Запускаем роутер после проверки авторизации
});
