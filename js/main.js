/* ==========================================================================
   INFORMATYK.BEST — Interactive UI Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* 1. Sticky Header Scroll State */
  const header = document.querySelector('.site-header');
  const backToTop = document.querySelector('.back-to-top');

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (backToTop) backToTop.classList.toggle('is-visible', y > 420);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* 2. Desktop Dropdown Accessibility (click toggle + outside click close) */
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
  dropdownItems.forEach((item) => {
    const trigger = item.querySelector('.nav-link');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });
  });

  document.addEventListener('click', (e) => {
    dropdownItems.forEach((item) => {
      if (!item.contains(e.target)) {
        item.classList.remove('is-open');
        const trigger = item.querySelector('.nav-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* 3. Mobile Off-Canvas Drawer & Submenu Accordion */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileClose = document.querySelector('.mobile-close');

  const setDrawer = (open) => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.toggle('is-open', open);
    mobileDrawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (mobileToggle) mobileToggle.addEventListener('click', () => setDrawer(true));
  if (mobileClose) mobileClose.addEventListener('click', () => setDrawer(false));
  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) setDrawer(false);
    });
  }

  const accBtns = document.querySelectorAll('.mobile-acc-btn');
  accBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const submenu = btn.nextElementSibling;
      if (submenu) {
        const isOpen = submenu.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(isOpen));
        const arrow = btn.querySelector('.acc-arrow');
        if (arrow) arrow.textContent = isOpen ? '−' : '+';
      }
    });
  });

  /* 4. Scroll Reveal Animations */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* 5. Animated Stat Counters (like ocalewski.pl) */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1200;
          const start = performance.now();

          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = target + suffix;
            }
          };
          requestAnimationFrame(step);
          countIO.unobserve(el);
        });
      },
      { threshold: 0.35 }
    );
    counters.forEach((c) => countIO.observe(c));
  }

  /* 6. FAQ Accordion */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach((other) => other.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* 7. Poradniki / YouTube Category Filter */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const guideCards = document.querySelectorAll('.guide-card[data-cat]');
  if (filterBtns.length && guideCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.filter;
        filterBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        guideCards.forEach((card) => {
          const match = cat === 'all' || card.dataset.cat === cat;
          card.style.display = match ? 'flex' : 'none';
        });
      });
    });
  }

  /* 8. Booking / Contact Form Demo Submission */
  const bookingForm = document.querySelector('#booking-form');
  if (bookingForm) {
    // Pre-select service from URL query param ?usluga=...
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('usluga');
    const selectEl = bookingForm.querySelector('#service-select');
    if (serviceParam && selectEl) {
      Array.from(selectEl.options).forEach((opt) => {
        if (opt.value === serviceParam) opt.selected = true;
      });
    }

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = bookingForm.querySelector('#client-name')?.value.trim() || 'Klient';
      const service = selectEl?.options[selectEl.selectedIndex]?.text || 'wybrana usługa';
      const successBox = document.querySelector('#form-success');
      if (successBox) {
        successBox.innerHTML = `Dziękuję, <strong>${name}</strong>! Zgłoszenie w sprawie: <strong>${service}</strong> zostało zapisane (tryb mockupu HTML). W docelowym WordPressie wiadomość trafi bezpośrednio przez WP Mail SMTP na skrzynkę Damiana.`;
        successBox.classList.add('is-visible');
      }
      bookingForm.reset();
    });
  }
});
