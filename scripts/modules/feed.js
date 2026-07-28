import { db } from '../config/firebase.js';
import { collection, query, where, getDocs, limit, startAfter, orderBy } from 'firebase/firestore';
import { state } from '../core/state.js';
import { initStaggerAnimations, init3DTilt } from '../ui/animations.js';

export const loadFeed = async (reset = false) => {
  if (reset) { state.feedCache = []; state.lastVisibleDoc = null; }
  const feedContainer = document.getElementById('feed-container');
  if(!feedContainer) return;

  try {
    const minAge = parseInt(document.getElementById('filter-min-age')?.value) || 18;
    const maxAge = parseInt(document.getElementById('filter-max-age')?.value) || 99;
    const city = document.getElementById('filter-city')?.value || '';
    
    let q = query(collection(db, 'users'), where('uid', '!=', state.user.uid), where('age', '>=', minAge), where('age', '<=', maxAge), orderBy('age'), limit(10));
    // Примечание: Firestore требует индексы для составных запросов. Для упрощения city фильтруем на клиенте.
    if (state.lastVisibleDoc) q = query(q, startAfter(state.lastVisibleDoc));
    
    const snap = await getDocs(q);
    if (!snap.empty) {
      state.lastVisibleDoc = snap.docs[snap.docs.length - 1];
      snap.forEach(doc => {
        const data = doc.data();
        if ((!city || data.city === city) && !state.profile.dislikedBy?.includes(data.uid)) {
          state.feedCache.push(data);
          renderCard(data, feedContainer, state.feedCache.length - 1);
        }
      });
      initStaggerAnimations();
      init3DTilt();
    }
  } catch (error) { console.error(error); }
};

const renderCard = (user, container, index) => {
  const card = document.createElement('div');
  card.className = 'card glass-panel stagger-in';
  card.style.animationDelay = `${index * 0.1}s`;
  card.innerHTML = `
    <img src="${user.photoURL || getDefaultAvatar()}" loading="lazy" alt="Фото">
    <div class="card-content">
      <h3>${user.name}, ${user.age}</h3>
      <p>📍 ${user.city || 'Не указан'}</p>
      <p>${user.about ? user.about.substring(0, 100) + '...' : ''}</p>
    </div>
    <div class="card-actions">
      <button class="btn-dislike" onclick="dislikeUser('${user.uid}', this)">👎</button>
      <button class="btn-like" onclick="likeUser('${user.uid}', this)">❤️</button>
    </div>
  `;
  container.appendChild(card);
};

// Infinite scroll
window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
    // В реальном проекте здесь throttle/debounce. Для простоты опущен.
  }
});