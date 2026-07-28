import { auth, db } from '../config/firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { state } from '../core/state.js';
import { navigate, handleRoute } from '../core/router.js';
import { showSpinner, hideSpinner, showToast } from '../ui/loader.js';

export const initAuth = () => {
  // Вешаем глобальный слушатель на весь документ
  document.addEventListener('click', async (e) => {
    
    // Проверяем, что клик был именно по кнопке регистрации
    // Убедитесь, что ID совпадает с тем, что в renderRegister()
    if (e.target.id === 'submit-register-btn') {
      e.preventDefault(); // Останавливаем стандартную перезагрузку страницы
      
      // Здесь ваш код получения данных из полей
      // const email = document.getElementById('reg-email').value;
      // ... и вызов функции createUserWithEmailAndPassword из Firebase
      console.log('Кнопка регистрации нажата!'); 
    }
  });

  // То же самое для формы входа
  document.addEventListener('click', async (e) => {
    if (e.target.id === 'submit-login-btn') {
      e.preventDefault();
      // Логика входа
    }
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
