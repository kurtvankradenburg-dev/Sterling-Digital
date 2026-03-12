/* ============================================
   STERLING DIGITAL — MAIN.JS
   Interactivity, animations, and utilities
   ============================================ */

(function () {
  'use strict';

  // --- Page Loader ---
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 600);
    });
    // Fallback: hide after 2s
    setTimeout(() => loader.classList.add('hidden'), 2000);
  }

  // --- Theme Toggle ---
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('sd-theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('sd-theme', next);
    });
  }

  // --- Sticky Nav ---
  const nav = document.querySelector('.nav');
  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --- Mobile Menu ---
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on theme toggle click (mobile)
    const mobileThemeToggle = navLinks.querySelector('.theme-toggle');
    if (mobileThemeToggle) {
      mobileThemeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  // --- Active Nav Link ---
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '/' && href === '/')) {
      link.classList.add('active');
    }
  });

  // --- Custom Cursor ---
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX - 4 + 'px';
      cursorDot.style.top = mouseY - 4 + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX - 18 + 'px';
      cursorRing.style.top = ringY - 18 + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const interactives = document.querySelectorAll('a, button, .card, .portfolio-card, .btn, input, textarea, select');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  // --- Scroll Reveal (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');

  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // --- Back to Top ---
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Contact Form Validation ---
  const form = document.getElementById('contact-form');
  const successMsg = document.querySelector('.form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      let valid = true;

      // Clear previous errors
      form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
        input.classList.remove('error');
      });
      form.querySelectorAll('.form-error').forEach(err => {
        err.classList.remove('show');
      });

      // Validate required fields
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');

      if (name && !name.value.trim()) {
        showError(name, 'Please enter your name');
        valid = false;
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
          showError(email, 'Please enter your email');
          valid = false;
        } else if (!emailRegex.test(email.value)) {
          showError(email, 'Please enter a valid email');
          valid = false;
        }
      }

      if (message && !message.value.trim()) {
        showError(message, 'Please enter a message');
        valid = false;
      }

      if (!valid) {
        e.preventDefault();
        return;
      }

      // If valid, let Netlify Forms handle the submission
      e.preventDefault();
      const formData = new FormData(form);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(() => {
        form.style.display = 'none';
        if (successMsg) successMsg.classList.add('show');
      })
      .catch(() => {
        form.style.display = 'none';
        if (successMsg) successMsg.classList.add('show');
      });
    });
  }

  function showError(input, msg) {
    input.classList.add('error');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.add('show');
    }
  }

  // --- Marquee: duplicate for seamless scroll ---
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack && !marqueeTrack.dataset.cloned) {
    const items = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML = items + items;
    marqueeTrack.dataset.cloned = 'true';
  }

})();
