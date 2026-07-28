import { initAuth } from './modules/auth.js';
import { handleRoute } from './core/router.js';
import { state } from './core/state.js';

// Init Bubbles
const initBubbles = () => {
  const container = document.getElementById('bg-bubbles');
  for (let i = 0; i < 20; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = Math.random() * 30 + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}vw`;
    bubble.style.animationDuration = `${Math.random() * 5 + 5}s`;
    bubble.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(bubble);
  }
};

// Theme toggler
document.getElementById('theme-toggle').addEventListener('click', () => {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', state.theme);
  localStorage.setItem('theme', state.theme);
});

// App Start
window.addEventListener('popstate', handleRoute);
document.body.setAttribute('data-theme', state.theme);
initBubbles();
initAuth(); // Запускает Firebase Auth и вызывает handleRoute()