export const showSpinner = () => document.getElementById('global-loader').classList.remove('hidden');
export const hideSpinner = () => document.getElementById('global-loader').classList.add('hidden');

export const showToast = (message, type = 'success') => {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `glass-panel toast ${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
};

window.showTerms = () => {
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-overlay" onclick="this.remove()">
      <div class="modal-content glass-panel" onclick="event.stopPropagation()">
        <h2>Пользовательское соглашение (18+)</h2>
        <p>1. Регистрируясь, вы подтверждаете, что вам есть 18 лет.</p>
        <p>2. Сервис собирает email и загруженные фото для работы функционала.</p>
        <p>3. Запрещена публикация непристойного контента.</p>
        <button onclick="document.querySelector('.modal-overlay').remove()">Закрыть</button>
      </div>
    </div>
  `;
};