export const getZodiacInfo = (birthDate) => {
  const d = new Date(birthDate);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  let sign = "", element = "", quality = "";

  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) { sign = "Овен"; element = "Fire"; quality = "Cardinal"; }
  else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) { sign = "Телец"; element = "Earth"; quality = "Fixed"; }
  else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) { sign = "Близнецы"; element = "Air"; quality = "Mutable"; }
  else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) { sign = "Рак"; element = "Water"; quality = "Cardinal"; }
  else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) { sign = "Лев"; element = "Fire"; quality = "Fixed"; }
  else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) { sign = "Дева"; element = "Earth"; quality = "Mutable"; }
  else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) { sign = "Весы"; element = "Air"; quality = "Cardinal"; }
  else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) { sign = "Скорпион"; element = "Water"; quality = "Fixed"; }
  else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) { sign = "Стрелец"; element = "Fire"; quality = "Mutable"; }
  else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) { sign = "Козерог"; element = "Earth"; quality = "Cardinal"; }
  else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) { sign = "Водолей"; element = "Air"; quality = "Fixed"; }
  else { sign = "Рыбы"; element = "Water"; quality = "Mutable"; }
  
  return { sign, element, quality };
};

export const getCompatibility = (d1, d2) => {
  if(!d1 || !d2) return 50;
  const z1 = getZodiacInfo(d1);
  const z2 = getZodiacInfo(d2);
  let percent = Math.floor(Math.random() * 50); // Рандом 0-50
  if (z1.element === z2.element) percent += 30;
  if (z1.quality === z2.quality) percent += 20;
  return percent;
};