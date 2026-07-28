import { state } from './state.js';
import { renderLogin, renderRegister, renderFeed, renderProfile, renderEditProfile, renderChats, renderChatRoom } from '../ui/render.js';
import { loadFeed } from '../modules/feed.js';
// Если будет нужен чат, импортнем позже, пока спасаем рендер

export const navigate = async (path) => {
  window.history.pushState({}, '', path);
  await handleRoute();
};

export const handleRoute = async () => {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const appDiv = document.getElementById('app');
  const header = document.getElementById('main-header');

  appDiv.style.opacity = '0'; 
  setTimeout(async () => {
    appDiv.innerHTML = '';
    
    // Если нет юзера и это не регистрация — на логин
    if (!state.user && path !== '/register') {
      header.style.display = 'none';
      appDiv.innerHTML = renderLogin();
    } 
    // Если нет юзера, но URL регистрации
    else if (!state.user && path === '/register') {
      header.style.display = 'none';
      appDiv.innerHTML = renderRegister();
    } 
    // Авторизованная зона
    else {
      header.style.display = 'flex';
      
      // Если профиль пуст (зашли только по Discord ID), заставляем заполнить Имя и Город
      if ((!state.profile?.name || !state.profile?.city) && path !== '/profile' && path !== '/edit-profile') {
        navigate('/edit-profile'); 
        return;
      }
      
      if (path === '/' || path === '') {
        appDiv.innerHTML = renderFeed();
        await loadFeed(true);
      } else if (path === '/profile') {
        const targetUid = searchParams.get('uid') || state.user.uid;
        appDiv.innerHTML = await renderProfile(targetUid);
      } else if (path === '/edit-profile') {
        appDiv.innerHTML = renderEditProfile();
      } else if (path === '/chats') {
        const chatId = searchParams.get('id');
        appDiv.innerHTML = chatId ? renderChatRoom(chatId) : renderChats();
      } else { 
        navigate('/'); 
      }
    }
    appDiv.style.transition = 'opacity 0.4s ease';
    appDiv.style.opacity = '1'; 
  }, 200);
};

// Перехват кликов по ссылкам SPA
document.addEventListener('click', e => {
  if (e.target.matches('[data-link]')) {
    e.preventDefault();
    navigate(e.target.getAttribute('href'));
  }
});
