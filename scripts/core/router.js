import { state } from './state.js';
import { renderLogin, renderRegister, renderFeed, renderProfile, renderChats, renderChatRoom } from '../ui/render.js';
import { loadFeed } from '../modules/feed.js';
import { getProfile } from '../modules/profile.js';

export const navigate = async (path) => {
  window.history.pushState({}, '', path);
  await handleRoute();
};

export const handleRoute = async () => {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const appDiv = document.getElementById('app');
  const header = document.getElementById('main-header');

  appDiv.style.opacity = '0'; // Fade out transition
  setTimeout(async () => {
    appDiv.innerHTML = '';
    if (!state.user && path !== '/register') {
      header.style.display = 'none';
      appDiv.innerHTML = renderLogin();
    } else if (!state.user && path === '/register') {
      header.style.display = 'none';
      appDiv.innerHTML = renderRegister();
    } else {
      header.style.display = 'flex';
      // Если профиль пуст (первый вход) и мы не на странице редактирования, редирект
      if (!state.profile?.name && path !== '/profile') {
        navigate('/profile'); return;
      }
      if (path === '/' || path === '') {
        appDiv.innerHTML = renderFeed();
        await loadFeed(true);
      } else if (path === '/profile') {
        const targetUid = searchParams.get('uid') || state.user.uid;
        appDiv.innerHTML = await renderProfile(targetUid);
      } else if (path === '/chats') {
        const chatId = searchParams.get('id');
        if(chatId) appDiv.innerHTML = renderChatRoom(chatId);
        else appDiv.innerHTML = renderChats();
      } else { navigate('/'); }
    }
    appDiv.style.transition = 'opacity 0.4s';
    appDiv.style.opacity = '1'; // Fade in
  }, 200);
};

// Перехват кликов по ссылкам SPA
document.addEventListener('click', e => {
  if (e.target.matches('[data-link]')) {
    e.preventDefault();
    navigate(e.target.getAttribute('href'));
  }
});