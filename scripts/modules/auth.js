import { auth, db } from '../config/firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { state } from '../core/state.js';
import { navigate, handleRoute } from '../core/router.js';
import { showSpinner, hideSpinner, showToast } from '../ui/loader.js';

export const initAuth = () => {
  onAuthStateChanged(auth, async (user) => {
    state.user = user;
    if (user) {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        state.profile = docSnap.data();
      } else {
        // Извлекаем Discord ID из технического email
        const discordId = user.email.split('@')[0];
        state.profile = { uid: user.uid, discordId: discordId, likesCount: 0, dislikedBy: [] };
        await setDoc(doc(db, 'users', user.uid), state.profile);
      }
    } else { state.profile = null; }
    handleRoute();
  });
};

export const login = async (discordId, password) => {
  if(!discordId) return showToast('Введите Discord ID', 'error');
  const syntheticEmail = `${discordId.trim().toLowerCase()}@rendezvous.local`;
  try { 
    showSpinner(); 
    await signInWithEmailAndPassword(auth, syntheticEmail, password); 
    showToast('Успешный вход!', 'success'); 
  }
  catch (e) { showToast('Ошибка: Неверный Discord ID или пароль', 'error'); } 
  finally { hideSpinner(); }
};

export const register = async (discordId, password) => {
  if(!discordId) return showToast('Введите Discord ID', 'error');
  const syntheticEmail = `${discordId.trim().toLowerCase()}@rendezvous.local`;
  try { 
    showSpinner(); 
    await createUserWithEmailAndPassword(auth, syntheticEmail, password); 
    showToast('Успешная регистрация!', 'success'); 
  }
  catch (e) { showToast('Ошибка: ' + e.message, 'error'); } 
  finally { hideSpinner(); }
};

export const logout = () => { signOut(auth); showToast('Вы вышли', 'success'); };

document.addEventListener('click', e => { if (e.target.id === 'logout-btn') logout(); });