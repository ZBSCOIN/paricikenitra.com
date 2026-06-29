// Par Ici Kénitra — comportements globaux

// --- Tweaks (palette switcher) ---
(function() {
  const palettes = ['ivory', 'lin', 'pierre'];
  const stored = localStorage.getItem('pik-palette') || 'ivory';
  if (palettes.includes(stored)) document.body.setAttribute('data-palette', stored);

  let panelMounted = false;
  function mountPanel() {
    if (panelMounted) return;
    const panel = document.createElement('div');
    panel.className = 'palette-tweak visible';
    panel.innerHTML = `
      <span>Palette</span>
      ${palettes.map(p => `<button data-palette="${p}" aria-label="${p}" class="${p===stored?'active':''}"></button>`).join('')}
    `;
    document.body.appendChild(panel);
    panel.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        const p = b.getAttribute('data-palette');
        if (p === 'ivory') document.body.removeAttribute('data-palette');
        else document.body.setAttribute('data-palette', p);
        localStorage.setItem('pik-palette', p);
        panel.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
        window.parent.postMessage({type: '__edit_mode_set_keys', edits: {palette: p}}, '*');
      });
    });
    panelMounted = true;
  }
  function hidePanel() {
    const p = document.querySelector('.palette-tweak');
    if (p) p.remove();
    panelMounted = false;
  }

  window.addEventListener('message', (e) => {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === '__activate_edit_mode') mountPanel();
    if (e.data.type === '__deactivate_edit_mode') hidePanel();
  });
  window.parent.postMessage({type: '__edit_mode_available'}, '*');
})();

// --- FAQ accordéon ---
document.addEventListener('click', (e) => {
  const q = e.target.closest('.faq-q');
  if (!q) return;
  const item = q.closest('.faq-item');
  item.classList.toggle('open');
});

// --- Fade-in observer ---
document.addEventListener('DOMContentLoaded', () => {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
});

// --- Form: empêcher submit (maquette) ---
document.addEventListener('submit', (e) => {
  if (e.target.matches('.contact-form')) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = 'Demande envoyée — nous vous recontactons sous 24h';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        btn.style.opacity = '';
      }, 4000);
    }
  }
});
