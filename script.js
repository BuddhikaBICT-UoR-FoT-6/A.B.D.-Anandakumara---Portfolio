(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const year = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const emailLink = document.getElementById('emailLink');

  // ══════════════════════════════════════════════
  //  TOAST NOTIFICATION SYSTEM
  // ══════════════════════════════════════════════
  const TOAST_ICONS = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  const TOAST_TITLES = {
    success: 'Success',
    error: 'Error',
    info: 'Info',
    warning: 'Warning',
  };

  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  /**
   * Show a toast notification.
   * @param {string} message  – Body text
   * @param {'success'|'error'|'info'|'warning'} type – Default 'info'
   * @param {string} [title]  – Override the default title
   * @param {number} [duration] – Auto-dismiss ms (default 3500)
   */
  window.showToast = function showToast(message, type = 'info', title, duration = 3500) {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.setAttribute('role', 'alert');
    t.innerHTML = `
      <span class="toast-left-bar"></span>
      <span class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</span>
      <span class="toast-body">
        <div class="toast-title">${title || TOAST_TITLES[type]}</div>
        <div class="toast-message">${message}</div>
      </span>
      <button class="toast-close" aria-label="Dismiss">&times;</button>
    `;

    toastContainer.appendChild(t);

    const dismiss = () => {
      t.classList.add('toast-exit');
      t.addEventListener('animationend', () => t.remove(), { once: true });
    };

    t.querySelector('.toast-close').addEventListener('click', dismiss);
    const timer = setTimeout(dismiss, duration);
    // Clear timer if user manually closes
    t.querySelector('.toast-close').addEventListener('click', () => clearTimeout(timer));

    return { dismiss };
  };

  // ══════════════════════════════════════════════
  //  PROFILE PHOTO (from admin localStorage)
  // ══════════════════════════════════════════════
  function initProfilePhoto() {
    const saved = localStorage.getItem('profilePhoto');
    const img = document.getElementById('profilePhotoImg');
    const fb = img ? img.nextElementSibling : null;
    if (saved && img) {
      img.src = saved;
      img.style.display = 'block';
      if (fb) fb.style.display = 'none';
    }
  }
  initProfilePhoto();

  // ══════════════════════════════════════════════
  //  SCROLL REVEAL

  // ══════════════════════════════════════════════
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('[data-animate]').forEach((el) => {
    revealObserver.observe(el);
  });

  // ══════════════════════════════════════════════
  //  ACTIVE NAV LINK ON SCROLL
  // ══════════════════════════════════════════════
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { threshold: 0.35, rootMargin: '-60px 0px -35% 0px' }
  );

  sections.forEach((sec) => navObserver.observe(sec));


  // ══════════════════════════════════════════════
  //  HEADER SHADOW ON SCROLL
  // ══════════════════════════════════════════════
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('shadow', window.scrollY > 20);
    }, { passive: true });
  }

  // ══════════════════════════════════════════════
  //  HAMBURGER MENU
  // ══════════════════════════════════════════════
  const hamburger = document.getElementById('hamburger');
  const primaryNav = document.getElementById('primaryNav');

  function openMenu() {
    primaryNav.classList.add('nav-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    primaryNav.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && primaryNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    // Close on nav-link click (mobile) 
    primaryNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) closeMenu();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ══════════════════════════════════════════════
  //  BACK TO TOP (floating button + footer link fix)
  // ══════════════════════════════════════════════
  // Inject floating button
  const bttBtn = document.createElement('button');
  bttBtn.className = 'back-to-top';
  bttBtn.setAttribute('aria-label', 'Back to top');
  bttBtn.innerHTML = '↑';
  document.body.appendChild(bttBtn);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  bttBtn.addEventListener('click', scrollToTop);

  // Fix the footer "Back to top" text link too
  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToTop();
    });
  });

  // Show/hide floating button
  window.addEventListener('scroll', () => {
    bttBtn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });


  // ══════════════════════════════════════════════
  //  YEAR
  // ══════════════════════════════════════════════
  if (year) year.textContent = String(new Date().getFullYear());

  // ══════════════════════════════════════════════
  //  THEME TOGGLE
  // ══════════════════════════════════════════════
  const preferredTheme = localStorage.getItem('theme');
  if (preferredTheme === 'light') {
    root.setAttribute('data-theme', 'light');
  }

  function toggleTheme() {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      showToast('Dark mode enabled', 'info', 'Theme', 2000);
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      showToast('Light mode enabled', 'info', 'Theme', 2000);
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // ══════════════════════════════════════════════
  //  SECRET ADMIN ACCESS
  // ══════════════════════════════════════════════
  let adminKeySequence = { ctrl: false, shift: false, a: false };

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) adminKeySequence.ctrl = true;
    if (e.shiftKey) adminKeySequence.shift = true;
    if (e.key.toLowerCase() === 'a') adminKeySequence.a = true;

    if (adminKeySequence.ctrl && adminKeySequence.shift && adminKeySequence.a) {
      e.preventDefault();
      showAdminLogin();
      adminKeySequence = { ctrl: false, shift: false, a: false };
    }
  });

  document.addEventListener('keyup', (e) => {
    if (!e.ctrlKey) adminKeySequence.ctrl = false;
    if (!e.shiftKey) adminKeySequence.shift = false;
    if (e.key.toLowerCase() === 'a') adminKeySequence.a = false;
  });

  function checkSecretURL() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('secret') === 'admin') {
      window.history.replaceState({}, document.title, window.location.pathname);
      showAdminLogin();
    }
  }

  function showAdminLogin() {
    // Remove any existing modal
    document.getElementById('adminLoginModal')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'adminLoginModal';
    overlay.className = 'admin-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Admin login');
    overlay.innerHTML = `
      <div class="admin-modal" id="adminModalBox">
        <div class="admin-modal-icon">🔐</div>
        <h2 class="admin-modal-title">Admin Access</h2>
        <p class="admin-modal-sub">Enter the admin password to continue.</p>
        <div class="admin-modal-field">
          <input
            type="password"
            id="adminPasswordInput"
            class="admin-modal-input"
            placeholder="Password"
            autocomplete="current-password"
            autofocus
          />
          <button class="admin-modal-eye" id="adminEyeBtn" type="button" aria-label="Toggle password visibility">�</button>
        </div>
        <div class="admin-modal-actions">
          <button class="button" id="adminLoginSubmit" type="button">Unlock →</button>
          <button class="button button-secondary" id="adminLoginCancel" type="button">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('#adminPasswordInput');
    const eyeBtn = overlay.querySelector('#adminEyeBtn');
    const submitB = overlay.querySelector('#adminLoginSubmit');
    const cancelB = overlay.querySelector('#adminLoginCancel');
    const box = overlay.querySelector('#adminModalBox');

    // Auto-focus after transition
    requestAnimationFrame(() => {
      overlay.classList.add('admin-modal-open');
      setTimeout(() => input.focus(), 200);
    });

    function shakeBox() {
      box.classList.remove('admin-modal-shake');
      // Force reflow
      void box.offsetWidth;
      box.classList.add('admin-modal-shake');
    }

    function closeModal() {
      overlay.classList.remove('admin-modal-open');
      setTimeout(() => overlay.remove(), 300);
    }

    function tryLogin() {
      const pw = input.value;
      if (pw === 'buddhika2026') {
        showToast('Access granted! Opening admin panel…', 'success', 'Welcome Back 🎉', 2500);
        sessionStorage.setItem('adminAuth', 'true');
        closeModal();
        setTimeout(() => { window.location.href = 'admin.html'; }, 1000);
      } else if (pw === '') {
        shakeBox();
        showToast('Please enter the admin password.', 'warning', 'Password Required');
      } else {
        shakeBox();
        input.value = '';
        showToast('Incorrect password. Try again.', 'error', 'Access Denied');
      }
    }

    submitB.addEventListener('click', tryLogin);
    cancelB.addEventListener('click', closeModal);

    // Eye toggle
    eyeBtn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      eyeBtn.textContent = show ? '🙈' : '👁';
    });

    // Enter key
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tryLogin();
      if (e.key === 'Escape') closeModal();
    });

    // Click outside = close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }


  checkSecretURL();

  // ══════════════════════════════════════════════
  //  CV / RESUME DOWNLOAD BUTTON
  // ══════════════════════════════════════════════
  function initCVButton() {
    const cvBtn = document.getElementById('cvDownloadBtn');
    if (!cvBtn) return;

    const resumeData = localStorage.getItem('resumeData');
    const resumeName = localStorage.getItem('resumeName') || 'Resume.pdf';

    if (resumeData) {
      // Resume uploaded via admin — make it downloadable
      cvBtn.style.display = 'inline-flex';
      cvBtn.addEventListener('click', (e) => {
        e.preventDefault();
        try {
          const link = document.createElement('a');
          link.href = resumeData;
          link.download = resumeName;
          link.click();
          showToast('Your download has started!', 'success', 'Downloading CV');
        } catch (err) {
          showToast('Could not download. Please try again.', 'error');
        }
      });
    } else {
      // No resume uploaded yet — hide button
      cvBtn.style.display = 'none';
    }
  }

  initCVButton();

  // ══════════════════════════════════════════════
  //  LOAD PORTFOLIO DATA FROM LOCALSTORAGE
  // ══════════════════════════════════════════════
  function loadPortfolioData() {
    const savedData = localStorage.getItem('portfolioData');
    if (!savedData) return;

    try {
      const data = JSON.parse(savedData);

      if (data.personal) {
        const brandText = document.querySelector('.brand-text');
        if (brandText) brandText.textContent = data.personal.fullName;

        const eyebrow = document.querySelector('.eyebrow');
        if (eyebrow) eyebrow.textContent = data.personal.title;

        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) heroTitle.textContent = data.personal.heroTitle;

        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
          heroSubtitle.innerHTML = data.personal.heroSubtitle.replace(
            data.personal.fullName,
            `<strong>${data.personal.fullName}</strong>`
          );
        }

        const githubLinks = document.querySelectorAll('a[href*="github"]');
        githubLinks.forEach(link => link.href = data.personal.github);

        const linkedinLinks = document.querySelectorAll('a[href*="linkedin"]');
        linkedinLinks.forEach(link => link.href = data.personal.linkedin);

        if (emailLink) {
          emailLink.href = `mailto:${data.personal.email}`;
          emailLink.textContent = data.personal.email;
        }

        const footerText = document.querySelector('.footer .muted');
        if (footerText) {
          footerText.innerHTML = `© <span id="year">${new Date().getFullYear()}</span> ${data.personal.fullName} — Built with ❤️`;
        }
      }

      if (data.about) {
        const profileCard = document.querySelector('#about .card p');
        if (profileCard) {
          const paragraphs = data.about.profile.split('\n\n');
          profileCard.parentElement.innerHTML = `
            <h3 class="card-title">Profile</h3>
            ${paragraphs.map(p => `<p>${p}</p>`).join('')}
          `;
        }

        const highlightsList = document.querySelector('#about .card:nth-child(2) ul');
        if (highlightsList && data.about.highlights) {
          highlightsList.innerHTML = data.about.highlights.map(h => `<li>${h}</li>`).join('');
        }
      }

      if (data.projects && data.projects.length > 0) {
        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
          projectsGrid.innerHTML = data.projects.map(project => `
            <article class="card project" data-animate>
              <div class="project-top">
                <h3 class="card-title">${project.title}</h3>
                <span class="badge">${project.badge}</span>
              </div>
              <p class="muted">${project.description}</p>
              <ul class="chips" aria-label="Tech stack">
                ${project.tech.map(tech => `<li class="chip">${tech}</li>`).join('')}
              </ul>
              <div class="card-actions">
                ${project.liveUrl && project.liveUrl !== '#' ? `<a class="text-link" href="${project.liveUrl}" target="_blank" rel="noreferrer">Live →</a>` : ''}
                ${project.codeUrl && project.codeUrl !== '#' ? `<a class="text-link" href="${project.codeUrl}" target="_blank" rel="noreferrer">Code →</a>` : ''}
              </div>
            </article>
          `).join('');
          // Re-observe new elements
          projectsGrid.querySelectorAll('[data-animate]').forEach(el => revealObserver.observe(el));
        }
      }
    } catch (err) {
      console.error('Error loading portfolio data:', err);
    }
  }

  loadPortfolioData();

  // ══════════════════════════════════════════════
  //  CONTACT FORM
  // ══════════════════════════════════════════════
  if (contactForm && emailLink) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const message = String(formData.get('message') || '').trim();

      if (!name || !email || !message) {
        showToast('Please fill in all fields before sending.', 'warning', 'Incomplete Form');
        return;
      }

      const to = emailLink.getAttribute('href')?.replace('mailto:', '') || '';
      const apiBase = typeof window !== 'undefined' ? String(window.PORTFOLIO_API_BASE || '').trim() : '';

      // Try backend API first
      if (apiBase !== undefined) {
        try {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending…';
          if (formNote) formNote.textContent = '';

          const resp = await fetch(`${apiBase.replace(/\/$/, '')}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message }),
          });

          const data = await resp.json().catch(() => ({}));

          if (resp.ok) {
            showToast(`Message sent! I'll get back to you soon, ${name}.`, 'success', 'Message Sent 🎉', 5000);
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message →';
            return;
          } else {
            throw new Error(data.error || `Status ${resp.status}`);
          }
        } catch (err) {
          console.error('API contact error:', err);
          showToast('Backend unavailable — opening your email app instead.', 'warning', 'Falling back');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message →';
        }
      }

      // Fallback: mailto
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      showToast('Opening your email app…', 'info', 'Email App');
    });
  }
})();
