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
