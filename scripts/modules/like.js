import { db } from '../config/firebase.js';
import { doc, setDoc, updateDoc, increment, serverTimestamp, getDoc } from 'firebase/firestore';
import { state } from '../core/state.js';
import { playLikeSound } from '../core/utils.js';
import { triggerHeartParticles } from '../ui/animations.js';

window.likeUser = async (targetUid, btnElement) => {
  if(btnElement.disabled) return;
  btnElement.disabled = true;
  const card = btnElement.closest('.card');
  triggerHeartParticles(card);
  playLikeSound();
  
  try {
    const likeId = `${state.user.uid}_${targetUid}`;
    await setDoc(doc(db, 'likes', likeId), { fromUid: state.user.uid, toUid: targetUid, type: 'like', timestamp: serverTimestamp() });
    await updateDoc(doc(db, 'users', targetUid), { likesCount: increment(1) });
    
    // Проверка взаимности
    const reverseLike = await getDoc(doc(db, 'likes', `${targetUid}_${state.user.uid}`));
    if(reverseLike.exists() && reverseLike.data().type === 'like') {
      const chatId = [state.user.uid, targetUid].sort().join('_');
      await setDoc(doc(db, 'chats', chatId), { participants: [state.user.uid, targetUid], lastUpdate: serverTimestamp() }, {merge: true});
    }
    
    setTimeout(() => card.remove(), 1000);
  } catch(e) { console.error(e); }
};

window.dislikeUser = async (targetUid, btnElement) => {
  btnElement.disabled = true;
  const card = btnElement.closest('.card');
  try {
    await updateDoc(doc(db, 'users', state.user.uid), { dislikedBy: arrayUnion(targetUid) });
    card.style.transform = 'translateX(-100%) rotate(-20deg)';
    setTimeout(() => card.remove(), 300);
  } catch(e) { console.error(e); }
};