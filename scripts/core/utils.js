import { showToast } from '../ui/loader.js';

export const calculateAge = (birthDate) => {
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};

export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_SIZE = 300; // Уменьшено для хранения в Base64 Firestore
        let width = img.width, height = img.height;
        if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } }
        else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
        canvas.width = width; canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        // Возвращаем Base64 напрямую, без Blob и Storage
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.onerror = (e) => reject(e);
    };
  });
};

export const playLikeSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch(e) {}
};

export const getDefaultAvatar = () => 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23FF69B4"><circle cx="50" cy="50" r="50" fill="%23f0f0f0"/><circle cx="50" cy="35" r="20"/><path d="M20 90 Q50 60 80 90 Z"/></svg>';