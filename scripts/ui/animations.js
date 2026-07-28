export const initStaggerAnimations = () => {
  const cards = document.querySelectorAll('.stagger-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { 
        entry.target.style.opacity = 1; 
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.1 });
  
  cards.forEach(card => {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });
};

export const init3DTilt = () => {
  document.querySelectorAll('.card').forEach(card => {
    let bounds, mouseX, mouseY;
    
    const rotateToMouse = () => {
      if (!bounds) return;
      const x = mouseX - bounds.left - bounds.width / 2;
      const y = mouseY - bounds.top - bounds.height / 2;
      
      const multiplier = 20;
      const rotateX = -(y / bounds.height) * multiplier;
      const rotateY = (x / bounds.width) * multiplier;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    card.addEventListener('mouseenter', () => { bounds = card.getBoundingClientRect(); });
    card.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      window.requestAnimationFrame(rotateToMouse);
    });
    card.addEventListener('mouseleave', () => { 
      card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
      bounds = null;
    });
  });
};

export const triggerHeartParticles = (element) => {
  const rect = element.getBoundingClientRect();
  const heartsCount = 20;
  
  for(let i=0; i < heartsCount; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = ['💖', '✨', '💕', '💗'][Math.floor(Math.random() * 4)];
    
    const size = Math.random() * 0.8 + 0.5;
    heart.style.fontSize = `${24 * size}px`;
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 100 + Math.random() * 150;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity - 100; // Немного тянем вверх
    const rot = (Math.random() - 0.5) * 200;
    
    heart.style.left = `${rect.left + rect.width/2 - 12}px`;
    heart.style.top = `${rect.top + rect.height/2 - 12}px`;
    heart.style.setProperty('--tx', `${tx}px`);
    heart.style.setProperty('--ty', `${ty}px`);
    heart.style.setProperty('--rot', `${rot}deg`);
    
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  }
};