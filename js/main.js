/* ============================================================
   PONTE VEDRA TREE — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ── Navigation ──────────────────────────────────────────── */
  const nav         = document.querySelector('.nav');
  const hamburger   = document.querySelector('.nav-hamburger');
  const mobileNav   = document.querySelector('.nav-mobile');

  // Sticky nav background on scroll
  function updateNav() {
    if (window.scrollY > 40) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Mobile hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link (highlights current page)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll Reveal (Fade-up animations) ──────────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Counter Animation (Stats Bar) ───────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(function (el) { counterObserver.observe(el); });
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = 1800;
    const steps    = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(function () {
      step++;
      current = Math.min(Math.round(increment * step), target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
  }

  /* ── Contact Form Handling ────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic client-side validation
      const requiredFields = contactForm.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#e05252';
          valid = false;
          field.addEventListener('input', function () {
            field.style.borderColor = '';
          }, { once: true });
        }
      });

      if (!valid) return;

      // Submit to Formspree
      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          contactForm.style.display = 'none';
          const success = document.getElementById('form-success');
          if (success) success.style.display = 'block';
        } else {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          alert('Something went wrong. Please call us at 904-477-1756 or email pontevedratreecrew@gmail.com.');
        }
      }).catch(function () {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert('Something went wrong. Please call us at 904-477-1756 or email pontevedratreecrew@gmail.com.');
      });
    });
  }

  /* ── Smooth scroll for anchor links ──────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── "Back to top" helper ─────────────────────────────────── */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.style.opacity = window.scrollY > 400 ? '1' : '0';
      backToTop.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
