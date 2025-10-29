// Portfolio Interactions
// - Mobile nav toggle
// - Active link on scroll
// - Dark mode toggle with persistence
// - AOS init

(function () {
  const body = document.body;
  const header = document.getElementById('header');
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const themeToggle = document.getElementById('themeToggle');
  const links = document.querySelectorAll('.nav-link');
  const yearSpan = document.getElementById('year');

  // Footer year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Theme persistence
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light');
  }

  const setThemeIcon = () => {
    const isLight = body.classList.contains('light');
    themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  };

  setThemeIcon();

  // Theme toggle
  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('light');
    localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
    setThemeIcon();
  });

  // Mobile nav toggle (Tailwind 'hidden' class)
  navToggle?.addEventListener('click', () => {
    const isHidden = navList?.classList.toggle('hidden');
    // If classList.toggle returned true, it means 'hidden' is now present
    navToggle.setAttribute('aria-expanded', String(!isHidden));
  });

  // Close mobile nav on link click
  links.forEach((a) => a.addEventListener('click', () => navList?.classList.add('hidden')));

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
        card.style.display = show ? 'flex' : 'none';
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


