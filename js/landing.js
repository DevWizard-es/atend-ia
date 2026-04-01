// ===== ATEND IA — LANDING JS =====

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Pricing toggle
const billingToggle = document.getElementById('billingToggle');
const monthlyPrices = document.querySelectorAll('.monthly-price');
const annualPrices = document.querySelectorAll('.annual-price');
const toggleMonthly = document.getElementById('toggleMonthly');
const toggleAnnual = document.getElementById('toggleAnnual');
let isAnnual = false;

billingToggle?.addEventListener('click', () => {
  isAnnual = !isAnnual;
  billingToggle.classList.toggle('annual', isAnnual);
  toggleMonthly.classList.toggle('active', !isAnnual);
  toggleAnnual.classList.toggle('active', isAnnual);
  monthlyPrices.forEach(el => el.style.display = isAnnual ? 'none' : 'inline');
  annualPrices.forEach(el => el.style.display = isAnnual ? 'inline' : 'none');
});

// FAQ toggle
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Chat demo animation - restart every 8 seconds
function restartChatDemo() {
  const bubbles = document.querySelectorAll('.chat-bubble');
  bubbles.forEach(b => {
    b.style.opacity = '0';
    b.style.animation = 'none';
  });
  setTimeout(() => {
    bubbles.forEach((b, i) => {
      void b.offsetWidth;
      b.style.animation = '';
    });
  }, 100);
}
setInterval(restartChatDemo, 9000);

// Intersection Observer for animations
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .testimonial-card, .plan-card, .step, .pain-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Counter animation for dashboard stats
function animateCounter(el, end, duration = 1500) {
  let start = 0;
  const step = end / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= end) { start = end; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      const values = [247, 38, 12];
      nums.forEach((el, i) => animateCounter(el, values[i]));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const dashStats = document.querySelector('.dash-stats');
if (dashStats) statsObserver.observe(dashStats);

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '60px';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = 'rgba(7,7,17,0.98)';
  navLinks.style.padding = '20px';
  navLinks.style.gap = '20px';
  navLinks.style.borderBottom = '1px solid rgba(124,58,237,0.2)';
});
