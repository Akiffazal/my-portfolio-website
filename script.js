// Portfolio Interactions
// - Mobile nav toggle
// - Active link on scroll
// - Dark mode toggle with persistence
// - AOS init

(function () {
  const body = document.body;
  const root = document.documentElement;
  const header = document.getElementById('header');
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const themeToggle = document.getElementById('themeToggle');
  const links = document.querySelectorAll('.nav-link');
  const yearSpan = document.getElementById('year');

  // Footer year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  const savedTheme = localStorage.getItem('theme');

  const applyTheme = (theme) => {
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    body.classList.toggle('light', nextTheme === 'light');
  };

  const getPreferredTheme = () => {
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  applyTheme(getPreferredTheme());

  const updateToggleState = () => {
    if (!themeToggle) return;
    const isLight = root.dataset.theme === 'light';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeToggle.setAttribute('aria-pressed', String(isLight));
  };

  updateToggleState();

  // Theme toggle
  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('theme', next);
    updateToggleState();
  });

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') return;
      applyTheme(event.matches ? 'light' : 'dark');
      updateToggleState();
    });
  }

  // Mobile nav toggle (Tailwind 'hidden' class)
  navToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navList) {
      const isHidden = navList.classList.toggle('hidden');
      navToggle.setAttribute('aria-expanded', String(!isHidden));
    }
  });

  // Close mobile nav on link click
  links.forEach((a) => {
    a.addEventListener('click', () => {
      if (navList) {
        navList.classList.add('hidden');
        navToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (navList && !navList.contains(e.target) && !navToggle?.contains(e.target) && !navList.classList.contains('hidden')) {
      navList.classList.add('hidden');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // Active link on scroll
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const onScroll = () => {
    const scrollPos = window.scrollY + 100; // offset for header
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      if (scrollPos >= top && scrollPos < bottom) link.classList.add('active');
      else link.classList.remove('active');
    });
    // Header subtle shadow on scroll (Tailwind class)
    if (window.scrollY > 10) header?.classList.add('shadow-lg');
    else header?.classList.remove('shadow-lg');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Project filtering (simple front-end filtering)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const cat = card.getAttribute('data-category') || '';
        const show = filter === 'all' || cat.split(/\s+/).includes(filter || '');
        if (show) {
          card.classList.remove('hidden');
          card.style.display = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Initialize AOS
  if (window.AOS) {
    window.AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 40,
    });
  }
})();
