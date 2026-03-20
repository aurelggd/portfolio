/**
 * script.js — Portfolio Dèlidji GBAGUIDI
 * ─────────────────────────────────────────
 * Table of contents
 *  1. Custom Cursor
 *  2. Mobile Menu (Hamburger)
 *  3. Scroll Reveal (IntersectionObserver)
 *  4. Card 3D Tilt Effect
 *  5. Hero Particle System (Canvas)
 *  6. Hero Typewriter Subtitle
 */

'use strict';

/* ─────────────────────────────────────────
   1. CUSTOM CURSOR
───────────────────────────────────────── */
function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursor.style.left = `${mouseX}px`;
    cursor.style.top  = `${mouseY}px`;
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = `${ringX}px`;
    ring.style.top  = `${ringY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const interactiveSelector = [
    'a', 'button',
    '.skill-row', '.soft-item',
    '.interest-pill', '.card', '.edu-card',
  ].join(', ');

  document.querySelectorAll(interactiveSelector).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      ring.style.opacity     = '0';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.opacity     = '0.5';
    });
  });
}


/* ─────────────────────────────────────────
   2. MOBILE MENU (Hamburger)
───────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  window.closeMenu = closeMenu;

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}


/* ─────────────────────────────────────────
   3. SCROLL REVEAL
───────────────────────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.07 }
  );

  document.querySelectorAll('.fade-up, .t-item, .edu-card').forEach((el) => {
    observer.observe(el);
  });

  document.querySelectorAll('.t-item').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
  });
}


/* ─────────────────────────────────────────
   4. CARD 3D TILT EFFECT
───────────────────────────────────────── */
function initCardTilt() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const rotateX = (y - rect.height / 2) / 22;
      const rotateY = (x - rect.width  / 2) / 22;

      card.style.transform = [
        'perspective(600px)',
        `rotateX(${-rotateX}deg)`,
        `rotateY(${rotateY}deg)`,
        'translateY(-4px)',
      ].join(' ');

      card.style.setProperty('--mx', `${(x / rect.width  * 100)}%`);
      card.style.setProperty('--my', `${(y / rect.height * 100)}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


/* ─────────────────────────────────────────
   5. HERO PARTICLE SYSTEM
   Draws a field of small glowing dots on a
   canvas. Each particle drifts slowly and
   fades in/out. Palette: purple & cyan.
───────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  /* Color palette matching CSS vars */
  const COLORS = [
    'rgba(124,58,237,',   // --accent  (purple)
    'rgba(6,182,212,',    // --accent2 (cyan)
    'rgba(168,85,247,',   // mid-purple
    'rgba(34,211,238,',   // light-cyan
  ];

  /* Particle factory */
  function makeParticle(w, h) {
    return {
      x:     Math.random() * w,
      y:     Math.random() * h,
      r:     Math.random() * 1.8 + 0.4,          // radius 0.4–2.2 px
      alpha: Math.random() * 0.5 + 0.1,           // opacity 0.1–0.6
      vx:    (Math.random() - 0.5) * 0.25,        // drift speed x
      vy:    (Math.random() - 0.5) * 0.25,        // drift speed y
      va:    (Math.random() - 0.5) * 0.003,       // alpha oscillation
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  /* Determine particle count (lower on mobile for perf) */
  function particleCount(w) {
    if (w < 600)  return 60;
    if (w < 1024) return 120;
    return 200;
  }

  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    const count = particleCount(W);
    particles = Array.from({ length: count }, () => makeParticle(W, H));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p) => {
      /* Move */
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.va;

      /* Bounce alpha */
      if (p.alpha > 0.65 || p.alpha < 0.05) p.va *= -1;

      /* Wrap edges */
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      /* Glow effect: soft outer circle + bright core */
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grd.addColorStop(0,   `${p.color}${p.alpha})`);
      grd.addColorStop(0.4, `${p.color}${p.alpha * 0.4})`);
      grd.addColorStop(1,   `${p.color}0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  /* Init & handle resize */
  resize();
  draw();

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
}


/* ─────────────────────────────────────────
   6. HERO TYPEWRITER SUBTITLE
   Types the subtitle text character by
   character after a short delay.
───────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('heroTyped');
  if (!el) return;

  const fullText = el.getAttribute('aria-label') || '';
  let index = 0;

  /* Start typing after the word-reveal animation finishes */
  const START_DELAY = 1300; // ms
  const CHAR_DELAY  = 28;   // ms per character

  setTimeout(function type() {
    if (index <= fullText.length) {
      el.textContent = fullText.slice(0, index);
      index++;
      setTimeout(type, CHAR_DELAY);
    }
  }, START_DELAY);
}


/* ─────────────────────────────────────────
   INIT — run everything on DOMContentLoaded
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Signal CSS that JS is active — enables hidden-then-reveal animations
  document.documentElement.classList.add('js-ready');

  initCursor();
  initMobileMenu();
  initScrollReveal();
  initCardTilt();
  initParticles();
  initTypewriter();
});

