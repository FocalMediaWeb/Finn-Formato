/* =============================================
   FINN FORMATO — script.js
   ============================================= */

// --- Nav scroll shadow ---
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });

// --- Mobile nav toggle ---
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

navToggle.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// --- Smooth scroll for all in-page anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// --- Scroll-triggered fade-up animations ---
const animTargets = document.querySelectorAll(
  '.svc-card, .project-card, .why-card, .stat-card, .about-text, .about-stats, .focal-text, .focal-card, .contact-info, .contact-cta-card, .section-header'
);

animTargets.forEach(el => el.classList.add('fade-up'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger cards within the same parent
          const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('fade-up'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('in'), idx * 70);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );
  animTargets.forEach(el => observer.observe(el));
} else {
  // Fallback: just show everything
  animTargets.forEach(el => el.classList.add('in'));
}
