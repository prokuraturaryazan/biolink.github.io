import { login, register } from '../modules/auth.js';
import { state } from '../core/state.js';
import { getCompatibility } from '../modules/zodiac.js';

export const renderLogin = () => `
  <div class="glass-panel scale-in" style="max-width: 400px; margin: 100px auto;">
    <h2 style="text-align:center; margin-bottom: 1.5rem;">Вход</h2>
    <input type="text" id="l-discord" placeholder="Discord ID">
    <input type="password" id="l-pass" placeholder="Пароль">
    <button class="glow-btn" onclick="login(document.getElementById('l-discord').value, document.getElementById('l-pass').value)" style="width: 100%; margin-top: 1rem;">Войти</button>
    <p style="text-align:center; margin-top:1.5rem;">
      <a href="/register" data-link class="animated-link">Нет аккаунта? Регистрация</a>
    </p>
  </div>
`;

export const renderRegister = () => `
  <div class="glass-panel scale-in" style="max-width: 400px; margin: 100px auto;">
    <h2 style="text-align:center; margin-bottom: 1.5rem;">Регистрация</h2>
    <input type="text" id="r-discord" placeholder="Discord ID">
    <input type="password" id="r-pass" placeholder="Пароль (min 6)">
    <label class="checkbox-label" style="display:flex; align-items:center; gap: 8px; margin: 15px 0;">
      <input type="checkbox" id="r-terms" onchange="document.getElementById('btn-reg').disabled = !this.checked"> 
      <span>Я принимаю <a href="#" class="animated-link" onclick="window.showTerms && window.showTerms(); return false;">соглашение</a></span>
    </label>
    <button id="btn-reg" class="glow-btn" disabled onclick="register(document.getElementById('r-discord').value, document.getElementById('r-pass').value)" style="width: 100%;">Зарегистрироваться</button>
    <p style="text-align:center; margin-top:1.5rem;"><a href="/" data-link class="animated-link">Уже есть аккаунт? Войти</a></p>
  </div>
`;

export const renderFeed = () => `
  <div class="fade-in" style="padding:1rem;">
    <div class="glass-panel filter-panel">
      <label class="filter-label">Возраст: <input type="number" id="filter-min-age" value="18" class="mini-input"> — <input type="number" id="filter-max-age" value="99" class="mini-input"></label>
      <input type="text" id="filter-city" placeholder="Город">
      <button class="glow-btn small" onclick="loadFeed(true)">Применить</button>
    </div>
    <div id="feed-container" class="feed-grid"></div>
  </div>
`;

export const renderProfile = async (targetUid) => {
  const isOwn = targetUid === state.user.uid;
  const profile = isOwn ? state.profile : { name: "Загрузка..." };
  let compHtml = '';
  
  if(!isOwn && state.profile.birthDate && profile.birthDate) {
    const comp = getCompatibility(state.profile.birthDate, profile.birthDate);
    compHtml = `<div class="compatibility-badge">Совместимость: <b>${comp}%</b></div>`;
  }
  
  return `
    <div class="glass-panel scale-in profile-card" style="max-width: 600px; margin: 40px auto; position: relative;">
      <div class="profile-avatar-wrapper" style="text-align:center;">
        <img src="${profile.photoURL || 'assets/default-avatar.png'}" class="profile-avatar" style="width:150px; height:150px; border-radius:50%; object-fit:cover;" alt="Аватар">
      </div>
      <h2 style="text-align:center; margin-top: 1rem;">${profile.name || 'Аноним'} (Discord: ${profile.discordId || 'Не указан'})</h2>
      ${compHtml}
      <div class="stats-row" style="text-align:center; margin: 10px 0;">
        <div class="stat-item"><span class="stat-value" id="likes-count">${profile.likesCount || 0}</span> <span class="stat-label">Лайков</span></div>
        <div>📍 ${profile.city || 'Город не указан'}</div>
        <p style="margin-top:10px;">${profile.about || ''}</p>
      </div>
      <div class="action-row" style="display:flex; justify-content:center; gap: 10px; margin-top:20px;">
        ${isOwn ? '<button class="glow-btn" onclick="navigate(\'/edit-profile\')">Редактировать</button>' : ''}
        <button class="outline-btn" onclick="navigator.clipboard.writeText(window.location.origin + '/profile?uid=${targetUid}'); alert('Ссылка скопирована!');">Поделиться</button>
      </div>
    </div>
  `;
};

export const renderEditProfile = () => `
  <div class="glass-panel scale-in" style="max-width: 600px; margin: 40px auto;">
    <h2 style="text-align:center; margin-bottom:1rem;">Редактирование профиля</h2>
    <div style="text-align:center; margin-bottom:1rem;">
      <img id="edit-avatar-preview" src="${state.profile?.photoURL || ''}" style="width:120px; height:120px; border-radius:50%; object-fit:cover; border:2px solid var(--primary); display:${state.profile?.photoURL ? 'inline-block' : 'none'}">
    </div>
    <label style="font-size: 0.9rem; margin-left: 5px;">Фото профиля:</label>
    <input type="file" id="edit-photo" accept="image/jpeg, image/png">
    <input type="text" id="edit-name" placeholder="Ваше Имя" value="${state.profile?.name || ''}">
    <label style="font-size: 0.9rem; margin-left: 5px;">Дата рождения (для Зодиака):</label>
    <input type="date" id="edit-birth" value="${state.profile?.birthDate || ''}">
    <input type="text" id="edit-city" placeholder="Ваш Город" value="${state.profile?.city || ''}">
    <textarea id="edit-about" placeholder="О себе" rows="4">${state.profile?.about || ''}</textarea>
    <button class="glow-btn" style="width:100%; margin-top: 15px;" onclick="window.saveProfile()">Сохранить профиль</button>
  </div>
`;

export const renderChats = () => `
  <div class="fade-in" style="padding:1rem; max-width: 800px; margin: 0 auto;">
    <h2 style="margin-bottom: 1rem;">Ваши диалоги</h2>
    <div id="chats-list" class="glass-panel" style="min-height: 200px;">
       <p style="text-align:center; color: var(--text-dark);">Раздел в разработке... Ставьте взаимные лайки!</p>
    </div>
  </div>
`;

export const renderChatRoom = (chatId) => `
  <div class="fade-in glass-panel" style="max-width: 800px; margin: 20px auto; display:flex; flex-direction:column; height: 70vh;">
    <button class="outline-btn" style="align-self: flex-start; margin-bottom: 1rem;" onclick="navigate('/chats')">← Назад</button>
    <div id="chat-messages" style="flex:1; overflow-y:auto; padding:1rem; border:1px solid var(--glass-border); border-radius:12px; margin-bottom:1rem; display:flex; flex-direction:column; gap: 10px;"></div>
    <div style="display:flex; gap:10px;">
      <input type="text" id="msg-input" placeholder="Введите сообщение..." style="margin:0;">
      <button class="glow-btn" onclick="sendMessage('${chatId}', 'msg-input')">Отправить</button>
    </div>
  </div>
`;

window.login = login; 
window.register = register;
window.navigate = (path) => { 
  import('../core/router.js').then(m => m.navigate(path)) 
};
