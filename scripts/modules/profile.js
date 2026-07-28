import { db } from '../config/firebase.js';
import { doc, updateDoc } from 'firebase/firestore';
import { state } from '../core/state.js';
import { compressImage, calculateAge } from '../core/utils.js';
import { showSpinner, hideSpinner, showToast } from '../ui/loader.js';

window.saveProfile = async () => {
  const name = document.getElementById('edit-name').value.trim();
  const birthDate = document.getElementById('edit-birth').value;
  const city = document.getElementById('edit-city').value.trim();
  const about = document.getElementById('edit-about').value.trim();
  const photoFile = document.getElementById('edit-photo').files[0];

  if (!name || !birthDate || !city) {
    return showToast('Имя, дата рождения и город обязательны!', 'error');
  }

  showSpinner();
  try {
    let photoURL = state.profile?.photoURL || '';
    
    // Если загрузили новую картинку — жмем её в base64 через canvas
    if (photoFile) {
      photoURL = await compressImage(photoFile); 
    }

    const age = calculateAge(birthDate);

    const updatedData = {
      name, 
      birthDate, 
      age, 
      city, 
      about, 
      photoURL
    };

    await updateDoc(doc(db, 'users', state.user.uid), updatedData);
    state.profile = { ...state.profile, ...updatedData };
    
    showToast('Профиль успешно сохранен!', 'success');
    window.navigate('/profile');
    
  } catch (error) {
    showToast('Ошибка при сохранении: ' + error.message, 'error');
    console.error(error);
  } finally {
    hideSpinner();
  }
};
