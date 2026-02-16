(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const year = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const emailLink = document.getElementById('emailLink');

  year.textContent = String(new Date().getFullYear());

  const preferredTheme = localStorage.getItem('theme');
  if (preferredTheme === 'light') {
    root.setAttribute('data-theme', 'light');
  }

  function toggleTheme() {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // SECRET ADMIN ACCESS - Method 1: Keyboard Shortcut (Ctrl+Shift+A)
  let adminKeySequence = { ctrl: false, shift: false, a: false };

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) adminKeySequence.ctrl = true;
    if (e.shiftKey) adminKeySequence.shift = true;
    if (e.key.toLowerCase() === 'a') adminKeySequence.a = true;

    // Check if all keys are pressed
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

  // SECRET ADMIN ACCESS - Method 2: URL Parameter (for hosted environments)
  // Access via: yoursite.com/?secret=admin
  function checkSecretURL() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('secret') === 'admin') {
      // Clear the URL parameter to hide it
      window.history.replaceState({}, document.title, window.location.pathname);
      showAdminLogin();
    }
  }

  function showAdminLogin() {
    const password = prompt('🔐 Enter admin password:');
    // Simple password check - you can change this password
    if (password === 'buddhika2026') {
      sessionStorage.setItem('adminAuth', 'true');
      window.location.href = 'admin.html';
    } else if (password !== null) {
      alert('❌ Incorrect password!');
    }
  }

  // Check for secret URL on page load
  checkSecretURL();

  // Load portfolio data from localStorage if available
  function loadPortfolioData() {
    const savedData = localStorage.getItem('portfolioData');
    if (!savedData) return;

    try {
      const data = JSON.parse(savedData);

      // Update personal info
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

        // Update links
        const githubLinks = document.querySelectorAll('a[href*="github"]');
        githubLinks.forEach(link => link.href = data.personal.github);

        const linkedinLinks = document.querySelectorAll('a[href*="linkedin"]');
        linkedinLinks.forEach(link => link.href = data.personal.linkedin);

        if (emailLink) {
          emailLink.href = `mailto:${data.personal.email}`;
          emailLink.textContent = data.personal.email;
        }

        // Update footer
        const footerText = document.querySelector('.footer .muted');
        if (footerText) {
          footerText.innerHTML = `© <span id="year">${new Date().getFullYear()}</span> ${data.personal.fullName}`;
        }
      }

      // Update about section
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

      // Update skills
      if (data.skills) {
        const technicalList = document.querySelector('#skills .card:first-child ul');
        if (technicalList && data.skills.technical) {
          technicalList.innerHTML = data.skills.technical.map(s => `<li>${s}</li>`).join('');
        }

        const softList = document.querySelector('#skills .card:last-child ul');
        if (softList && data.skills.soft) {
          softList.innerHTML = data.skills.soft.map(s => `<li>${s}</li>`).join('');
        }
      }

      // Update projects
      if (data.projects && data.projects.length > 0) {
        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
          projectsGrid.innerHTML = data.projects.map(project => `
            <article class="card project">
              <div class="project-top">
                <h3 class="card-title">${project.title}</h3>
                <span class="badge">${project.badge}</span>
              </div>
              <p class="muted">${project.description}</p>
              <ul class="chips" aria-label="Tech stack">
                ${project.tech.map(tech => `<li class="chip">${tech}</li>`).join('')}
              </ul>
              <div class="card-actions">
                <a class="text-link" href="${project.liveUrl}" aria-label="Open live demo">Live</a>
                <a class="text-link" href="${project.codeUrl}" aria-label="Open source code">Code</a>
              </div>
            </article>
          `).join('');
        }
      }
    } catch (err) {
      console.error('Error loading portfolio data:', err);
    }
  }

  // Load saved portfolio data on page load
  loadPortfolioData();

  if (contactForm && formNote && emailLink) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const message = String(formData.get('message') || '').trim();

      const to = emailLink.getAttribute('href')?.replace('mailto:', '') || 'you@example.com';
      const apiBase = typeof window !== 'undefined' ? String(window.PORTFOLIO_API_BASE || '').trim() : '';

      if (apiBase) {
        try {
          formNote.textContent = 'Sending…';

          const resp = await fetch(`${apiBase.replace(/\/$/, '')}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message }),
          });

          if (!resp.ok) {
            throw new Error(`Request failed with status ${resp.status}`);
          }

          formNote.textContent = 'Sent! I will get back to you soon.';
          contactForm.reset();
          return;
        } catch (err) {
          console.error(err);
          formNote.textContent = 'Could not send via backend. Falling back to email…';
        }
      }

      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      formNote.textContent = 'Opening your email app…';
    });
  }
})();
