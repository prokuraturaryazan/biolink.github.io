import { state } from './state.js';
import { renderLogin, renderRegister, renderFeed, renderProfile, renderEditProfile, renderChats, renderChatRoom } from '../ui/render.js';
import { loadFeed } from '../modules/feed.js';

export const navigate = (path) => {
  window.location.hash = path;
};

export const handleRoute = async () => {
  // Берем путь из хэша (всё что после #). Если пусто — значит мы на главной (/)
  const fullPath = window.location.hash.slice(1) || '/';
  
  // Разделяем путь и параметры (например, /profile?uid=123)
  const [path, queryString] = fullPath.split('?');
  const searchParams = new URLSearchParams(queryString || '');

  const appDiv = document.getElementById('app');
  const header = document.getElementById('main-header');

  appDiv.style.opacity = '0'; 
  setTimeout(async () => {
    appDiv.innerHTML = '';
    
    // Не авторизован и не на странице регистрации -> логин
    if (!state.user && path !== '/register') {
      header.style.display = 'none';
      appDiv.innerHTML = renderLogin();
    } 
    // Не авторизован, но на странице регистрации
    else if (!state.user && path === '/register') {
      header.style.display = 'none';
      appDiv.innerHTML = renderRegister();
    } 
    // Зона для авторизованных
    else {
      header.style.display = 'flex';
      
      // Форсируем заполнение профиля
      if ((!state.profile?.name || !state.profile?.city) && path !== '/profile' && path !== '/edit-profile') {
        navigate('/edit-profile'); 
        appDiv.style.opacity = '1';
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

// Слушаем изменение хэша (кнопки "назад/вперед" в браузере тоже будут работать)
window.addEventListener('hashchange', handleRoute);

// Больше не перехватываем клики вручную, браузер сам меняет хэш у ссылок
