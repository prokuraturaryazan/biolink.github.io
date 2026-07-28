import { db } from '../config/firebase.js';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { state } from '../core/state.js';

const ICEBREAKERS = [
  "Какое у тебя любимое место для свидания?",
  "Если бы ты могла взять только одну вещь на необитаемый остров, что бы это было?",
  "Твой идеальный выходной день?"
];

export const subscribeToMessages = (chatId, containerId) => {
  const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp'));
  return onSnapshot(q, (snapshot) => {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '';
    if(snapshot.empty) {
      container.innerHTML = `<button onclick="sendIcebreaker('${chatId}')" class="gold">Предложить тему (Ледокол)</button>`;
    }
    snapshot.forEach((doc) => {
      const msg = doc.data();
      const div = document.createElement('div');
      div.style.textAlign = msg.senderUid === state.user.uid ? 'right' : 'left';
      div.style.margin = '5px 0';
      div.innerHTML = `<span style="background:${msg.senderUid === state.user.uid ? 'var(--primary)' : 'var(--glass-bg)'}; color:${msg.senderUid === state.user.uid ? '#fff' : 'var(--text-dark)'}; padding: 10px; border-radius:10px; display:inline-block;">${msg.text}</span>`;
      container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
  });
};

window.sendMessage = async (chatId, textInputId) => {
  const input = document.getElementById(textInputId);
  const text = input.value.trim();
  if(!text) return;
  input.value = '';
  await addDoc(collection(db, 'chats', chatId, 'messages'), { senderUid: state.user.uid, text, timestamp: serverTimestamp() });
};

window.sendIcebreaker = async (chatId) => {
  const text = ICEBREAKERS[Math.floor(Math.random() * ICEBREAKERS.length)];
  await addDoc(collection(db, 'chats', chatId, 'messages'), { senderUid: state.user.uid, text: '👋 ' + text, timestamp: serverTimestamp() });
};