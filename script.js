// Theme toggle, mobile nav, reveal on scroll, simple contact form handler
(() => {
  const root = document.documentElement;
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  // Initialize year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Theme: restore from localStorage, otherwise use prefers-color-scheme
  function getSavedTheme(){
    try{
      return localStorage.getItem('bloom-theme');
    }catch(e){ return null; }
  }
  function saveTheme(v){
    try{ localStorage.setItem('bloom-theme', v); }catch(e){}
  }

  function applyTheme(theme){
    if(theme === 'dark'){
      body.classList.add('dark');
      themeToggle.setAttribute('aria-pressed','true');
    }else{
      body.classList.remove('dark');
      themeToggle.setAttribute('aria-pressed','false');
    }
  }

  const saved = getSavedTheme();
  if(saved){
    applyTheme(saved);
  }else{
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    applyTheme(isDark ? 'dark' : 'light');
    saveTheme(isDark ? 'dark' : 'light');

    // small tactile animation
    themeToggle.animate([{ transform: 'scale(1)' }, { transform: 'scale(.95)' }, { transform: 'scale(1)' }], { duration: 220 });
  });

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', (!expanded).toString());
    mainNav.style.display = expanded ? '' : 'flex';
  });

  // Simple reveal on scroll using IntersectionObserver
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Contact form - mock submit
  if(form){
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const name = data.get('name')?.toString().trim();
      const email = data.get('email')?.toString().trim();
      const message = data.get('message')?.toString().trim();

      if(!name || !email || !message){
        formStatus.textContent = 'Please fill all fields.';
        formStatus.style.color = 'var(--accent)';
        return;
      }

      // Simulate network request
      formStatus.style.color = '';
      formStatus.textContent = 'Sending...';
      setTimeout(() => {
        formStatus.style.color = 'green';
        formStatus.textContent = 'Thanks! Your message has been received (demo).';
        form.reset();
      }, 900);
    });

    form.addEventListener('reset', () => {
      formStatus.textContent = '';
    });
  }

  // Close mobile nav on link click (better UX)
  document.querySelectorAll('.main-nav a').forEach(a => {
    a.addEventListener('click', () => {
      if(window.innerWidth <= 640){
        mainNav.style.display = '';
        navToggle.setAttribute('aria-expanded','false');
      }
    });
  });
})();
