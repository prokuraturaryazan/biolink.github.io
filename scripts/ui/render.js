import { login, register } from '../modules/auth.js';
import { showModal } from './modal.js';
import { state } from '../core/state.js';
import { getCompatibility } from '../modules/zodiac.js';

export const renderLogin = () => `
  <div class="glass-panel scale-in" style="max-width: 400px; margin: 100px auto;">
    <h2 style="text-align:center; margin-bottom: 1.5rem; text-shadow: 0 2px 10px rgba(255,105,180,0.5);">Вход</h2>
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
    <h2 style="text-align:center; margin-bottom: 1.5rem; text-shadow: 0 2px 10px rgba(255,105,180,0.5);">Регистрация</h2>
    <input type="text" id="r-discord" placeholder="Discord ID">
    <input type="password" id="r-pass" placeholder="Пароль (min 6)">
    <label class="checkbox-label" style="display:flex; align-items:center; gap: 8px; margin: 15px 0;">
      <input type="checkbox" id="r-terms" onchange="document.getElementById('btn-reg').disabled = !this.checked"> 
      <span>Я принимаю <a href="#" class="animated-link" onclick="showTerms(); return false;">соглашение</a></span>
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
      <div class="profile-avatar-wrapper">
        <img src="${profile.photoURL || ''}" class="profile-avatar" alt="Аватар">
      </div>
      <h2 style="text-align:center; margin-top: 1rem;">${profile.name || 'Аноним'}</h2>
      ${compHtml}
      <div class="stats-row">
        <div class="stat-item"><span class="stat-value" id="likes-count">${profile.likesCount || 0}</span><span class="stat-label">Лайков</span></div>
      </div>
      <div class="action-row">
        ${isOwn ? '<button class="glow-btn" onclick="navigate(\'/edit-profile\')">Редактировать</button>' : '<button class="glow-btn gold" onclick="sendComplimentModal()">Сделать комплимент</button>'}
        <button class="outline-btn" onclick="navigator.clipboard.writeText(window.location.origin + '/profile?uid=${targetUid}'); alert('Ссылка скопирована!');">Поделиться</button>
      </div>
    </div>
  `;
};

window.login = login; window.register = register;