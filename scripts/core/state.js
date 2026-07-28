export const state = {
  user: null, // Текущий аутентифицированный пользователь
  profile: null, // Данные профиля из Firestore
  feedCache: [], // Кеш ленты
  lastVisibleDoc: null, // Для пагинации
  theme: localStorage.getItem('theme') || 'light'
};