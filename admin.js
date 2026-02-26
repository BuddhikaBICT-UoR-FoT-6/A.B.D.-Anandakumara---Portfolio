(function () {
    'use strict';

    // ── AUTH CHECK ─────────────────────────────────────────────
    const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
        window.location.href = 'index.html';
        return;
    }

    // ══════════════════════════════════════════════
    //  TOAST SYSTEM (self-contained for admin page)
    // ══════════════════════════════════════════════
    const TOAST_ICONS = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    const TOAST_TITLES = { success: 'Success', error: 'Error', info: 'Info', warning: 'Warning' };

    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    function showToast(message, type = 'info', title, duration = 3500) {
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
        const timer = setTimeout(dismiss, duration);
        t.querySelector('.toast-close').addEventListener('click', () => { clearTimeout(timer); dismiss(); });
    }

    // ══════════════════════════════════════════════
    //  DEFAULT DATA
    // ══════════════════════════════════════════════
    const defaultData = {
        personal: {
            fullName: 'Buddhika Darshan',
            title: 'BICT Undergraduate | Full-Stack Developer | OCI Certified',
            heroTitle: 'I build software that works as good as it looks.',
            heroSubtitle: "I'm Buddhika Darshan — a final-year engineer who turns complex problems into clean, scalable, and impactful software.",
            email: 'buddhikadarshan1475@gmail.com',
            github: 'https://github.com/BuddhikaBICT-UoR-FoT-6',
            linkedin: 'https://www.linkedin.com/in/buddhika-darshan-9b9168252/'
        },
        about: {
            profile: `I am an innovative Full-Stack Software Engineer with a proven track record of architecting scalable, enterprise-level applications.\n\nBy leveraging a diverse tech stack including React, Angular, Node.js, and Kotlin, I build robust solutions. Open for internships and collaborations.`,
            highlights: [
                'Oracle Certified Foundations Associate (OCI)',
                'Final Year BICT at University of Ruhuna',
                'Built CeylonQueueBusPulse — real-time transit platform',
                'Deployed apps on Azure, Vercel & Railway'
            ]
        },
        skills: {
            technical: ['JavaScript / TypeScript', 'Node.js / Express', 'React / Angular', 'Kotlin / Android'],
            soft: ['Communication', 'Teamwork', 'Problem-solving', 'Git & GitHub']
        },
        projects: []
    };

    let portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || defaultData;

    // ══════════════════════════════════════════════
    //  DOM REFS
    // ══════════════════════════════════════════════
    const saveBtn = document.getElementById('saveBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const projectsContainer = document.getElementById('projectsContainer');
    // Resume
    const resumeDropZone = document.getElementById('resumeDropZone');
    const resumeFileInput = document.getElementById('resumeFileInput');
    const resumeBrowseBtn = document.getElementById('resumeBrowseBtn');
    const resumeCurrentInfo = document.getElementById('resumeCurrentInfo');
    const resumeCurrentName = document.getElementById('resumeCurrentName');
    const resumeRemoveBtn = document.getElementById('resumeRemoveBtn');
    // Profile Photo
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const profilePhotoBrowseBtn = document.getElementById('profilePhotoBrowseBtn');
    const profilePhotoRemoveBtn = document.getElementById('profilePhotoRemoveBtn');
    const adminPhotoPreview = document.getElementById('adminPhotoPreview');
    const adminPhotoFallback = document.getElementById('adminPhotoFallback');

    // ── Profile Photo: load saved ──
    (function initAdminPhoto() {
        const saved = localStorage.getItem('profilePhoto');
        if (saved) {
            adminPhotoPreview.src = saved;
            adminPhotoPreview.style.display = 'block';
            adminPhotoFallback.style.display = 'none';
            profilePhotoRemoveBtn.style.display = '';
        }
    })();

    profilePhotoBrowseBtn.addEventListener('click', () => profilePhotoInput.click());
    profilePhotoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.type)) {
            showToast('Only JPG, PNG, WebP or GIF images are supported.', 'error', 'Invalid File');
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            showToast('Photo is too large. Please use an image under 3 MB.', 'warning', 'File Too Large');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                localStorage.setItem('profilePhoto', ev.target.result);
                adminPhotoPreview.src = ev.target.result;
                adminPhotoPreview.style.display = 'block';
                adminPhotoFallback.style.display = 'none';
                profilePhotoRemoveBtn.style.display = '';
                showToast('Profile photo updated! It now appears on your portfolio.', 'success', 'Photo Uploaded ✓', 4500);
            } catch {
                showToast('Storage quota exceeded. Try a smaller image.', 'error', 'Upload Failed');
            }
        };
        reader.onerror = () => showToast('Could not read the file. Please try again.', 'error');
        reader.readAsDataURL(file);
    });

    profilePhotoRemoveBtn.addEventListener('click', () => {
        if (!confirm('Remove your profile photo? The default initial will be shown instead.')) return;
        localStorage.removeItem('profilePhoto');
        adminPhotoPreview.src = '';
        adminPhotoPreview.style.display = 'none';
        adminPhotoFallback.style.display = '';
        profilePhotoRemoveBtn.style.display = 'none';
        showToast('Profile photo removed.', 'info', 'Photo Removed');
    });


    // ──────────────────────────────────────────────
    function loadFormData() {
        document.getElementById('fullName').value = portfolioData.personal.fullName;
        document.getElementById('title').value = portfolioData.personal.title;
        document.getElementById('heroTitle').value = portfolioData.personal.heroTitle;
        document.getElementById('heroSubtitle').value = portfolioData.personal.heroSubtitle;
        document.getElementById('email').value = portfolioData.personal.email;
        document.getElementById('github').value = portfolioData.personal.github;
        document.getElementById('linkedin').value = portfolioData.personal.linkedin;
        document.getElementById('aboutProfile').value = portfolioData.about.profile;
        document.getElementById('aboutHighlights').value = portfolioData.about.highlights.join('\n');
        document.getElementById('technicalSkills').value = portfolioData.skills.technical.join('\n');
        document.getElementById('softSkills').value = portfolioData.skills.soft.join('\n');
        renderProjects();
        refreshResumeUI();
    }

    // ──────────────────────────────────────────────
    //  RESUME SECTION
    // ──────────────────────────────────────────────
    function refreshResumeUI() {
        const name = localStorage.getItem('resumeName');
        if (name) {
            resumeCurrentName.textContent = name;
            resumeCurrentInfo.style.display = 'flex';
            resumeDropZone.style.display = 'none';
        } else {
            resumeCurrentInfo.style.display = 'none';
            resumeDropZone.style.display = '';
        }
    }

    function handleResumeFile(file) {
        if (!file) return;
        if (file.type !== 'application/pdf') {
            showToast('Only PDF files are supported.', 'error', 'Invalid File');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5 MB limit
            showToast('File is too large. Please upload a PDF under 5 MB.', 'warning', 'File Too Large');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                localStorage.setItem('resumeData', e.target.result);
                localStorage.setItem('resumeName', file.name);
                refreshResumeUI();
                showToast(`"${file.name}" uploaded — CV button is now live on your portfolio!`, 'success', 'Resume Uploaded ✓', 5000);
            } catch (err) {
                showToast('Storage quota exceeded. Try a smaller file.', 'error', 'Upload Failed');
            }
        };
        reader.onerror = () => showToast('Could not read the file. Please try again.', 'error');
        reader.readAsDataURL(file);
    }

    // Browse button
    resumeBrowseBtn.addEventListener('click', () => resumeFileInput.click());
    resumeFileInput.addEventListener('change', (e) => handleResumeFile(e.target.files[0]));

    // Drag & drop
    resumeDropZone.addEventListener('dragover', (e) => { e.preventDefault(); resumeDropZone.classList.add('drag-over'); });
    resumeDropZone.addEventListener('dragleave', () => resumeDropZone.classList.remove('drag-over'));
    resumeDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        resumeDropZone.classList.remove('drag-over');
        handleResumeFile(e.dataTransfer.files[0]);
    });

    // Remove resume
    resumeRemoveBtn.addEventListener('click', () => {
        if (!confirm('Remove the uploaded resume? The CV button will disappear from the portfolio.')) return;
        localStorage.removeItem('resumeData');
        localStorage.removeItem('resumeName');
        refreshResumeUI();
        showToast('Resume removed from your portfolio.', 'info', 'Resume Removed');
    });

    // ──────────────────────────────────────────────
    //  PROJECTS
    // ──────────────────────────────────────────────
    function renderProjects() {
        projectsContainer.innerHTML = '';
        portfolioData.projects.forEach((project, index) => {
            const div = document.createElement('div');
            div.className = 'project-item';
            div.innerHTML = `
        <h4>Project ${index + 1}</h4>
        <div class="admin-field">
          <label>Title</label>
          <input type="text" class="project-title" data-index="${index}" value="${escHtml(project.title)}">
        </div>
        <div class="admin-field">
          <label>Badge (e.g. Web / App / Mobile)</label>
          <input type="text" class="project-badge" data-index="${index}" value="${escHtml(project.badge)}">
        </div>
        <div class="admin-field">
          <label>Description</label>
          <textarea class="project-description" data-index="${index}">${escHtml(project.description)}</textarea>
        </div>
        <div class="admin-field">
          <label>Technologies (comma separated)</label>
          <input type="text" class="project-tech" data-index="${index}" value="${escHtml(project.tech.join(', '))}">
        </div>
        <div class="admin-field">
          <label>Live URL</label>
          <input type="url" class="project-live" data-index="${index}" value="${escHtml(project.liveUrl || '')}">
        </div>
        <div class="admin-field">
          <label>Code / GitHub URL</label>
          <input type="url" class="project-code" data-index="${index}" value="${escHtml(project.codeUrl || '')}">
        </div>
        <button class="button button-secondary" onclick="deleteProject(${index})" style="margin-top:4px;">🗑 Delete Project</button>
      `;
            projectsContainer.appendChild(div);
        });
    }

    function escHtml(str) {
        return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    window.deleteProject = function (index) {
        if (!confirm('Delete this project?')) return;
        const removed = portfolioData.projects[index].title;
        portfolioData.projects.splice(index, 1);
        renderProjects();
        showToast(`Project "${removed}" deleted.`, 'info', 'Project Deleted');
    };

    addProjectBtn.addEventListener('click', () => {
        portfolioData.projects.push({
            title: 'New Project', badge: 'Web',
            description: 'Describe what this project does.', tech: ['Tech1'],
            liveUrl: '', codeUrl: ''
        });
        renderProjects();
        showToast('New project added. Fill in the details and save.', 'info', 'Project Added');
        // Scroll to the bottom of the list
        projectsContainer.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ──────────────────────────────────────────────
    //  SAVE
    // ──────────────────────────────────────────────
    saveBtn.addEventListener('click', async () => {
        saveBtn.disabled = true;
        saveBtn.textContent = '⏳ Saving…';

        portfolioData.personal = {
            fullName: document.getElementById('fullName').value.trim(),
            title: document.getElementById('title').value.trim(),
            heroTitle: document.getElementById('heroTitle').value.trim(),
            heroSubtitle: document.getElementById('heroSubtitle').value.trim(),
            email: document.getElementById('email').value.trim(),
            github: document.getElementById('github').value.trim(),
            linkedin: document.getElementById('linkedin').value.trim()
        };

        portfolioData.about = {
            profile: document.getElementById('aboutProfile').value.trim(),
            highlights: document.getElementById('aboutHighlights').value.split('\n').map(h => h.trim()).filter(Boolean)
        };

        portfolioData.skills = {
            technical: document.getElementById('technicalSkills').value.split('\n').map(s => s.trim()).filter(Boolean),
            soft: document.getElementById('softSkills').value.split('\n').map(s => s.trim()).filter(Boolean)
        };

        // Collect projects
        const titles = document.querySelectorAll('.project-title');
        const badges = document.querySelectorAll('.project-badge');
        const descriptions = document.querySelectorAll('.project-description');
        const techs = document.querySelectorAll('.project-tech');
        const lives = document.querySelectorAll('.project-live');
        const codes = document.querySelectorAll('.project-code');

        portfolioData.projects = [];
        titles.forEach((_, i) => {
            portfolioData.projects.push({
                title: titles[i].value.trim(),
                badge: badges[i].value.trim(),
                description: descriptions[i].value.trim(),
                tech: techs[i].value.split(',').map(t => t.trim()).filter(Boolean),
                liveUrl: lives[i].value.trim(),
                codeUrl: codes[i].value.trim()
            });
        });

        try {
            localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        } catch (err) {
            showToast('localStorage quota exceeded. Try removing the resume.', 'error', 'Save Failed');
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Save All Changes';
            return;
        }

        // Try backend
        try {
            const apiBase = String(window.PORTFOLIO_API_BASE || '').trim();
            if (apiBase) {
                await fetch(`${apiBase.replace(/\/$/, '')}/api/save-portfolio`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(portfolioData)
                });
            }
        } catch (e) {
            console.log('Backend save failed, localStorage only:', e);
        }

        showToast('All changes saved! Your portfolio is up to date.', 'success', 'Saved ✓', 4000);
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save All Changes';
    });

    // ──────────────────────────────────────────────
    //  LOGOUT
    // ──────────────────────────────────────────────
    logoutBtn.addEventListener('click', () => {
        showToast('Logging you out…', 'info', 'Goodbye!', 1500);
        setTimeout(() => {
            sessionStorage.removeItem('adminAuth');
            window.location.href = 'index.html';
        }, 1600);
    });

    // ── INIT ──────────────────────────────────────
    document.getElementById('fullName').setAttribute('placeholder', 'e.g. Buddhika Darshan');
    loadFormData();
    showToast('Welcome back to the admin panel.', 'info', 'Admin Panel', 2500);

    // ──────────────────────────────────────────────
    //  UNSAVED CHANGES TOAST HINT
    // ──────────────────────────────────────────────
    let hasShownUnsavedHint = false;
    let unsavedTimer = null;

    function onFieldChange() {
        if (hasShownUnsavedHint) return;
        clearTimeout(unsavedTimer);
        unsavedTimer = setTimeout(() => {
            hasShownUnsavedHint = true;
            showToast('You have unsaved changes. Click "Save All Changes" when done.', 'warning', 'Unsaved Changes', 5000);
        }, 1500); // Wait 1.5s of inactivity after typing
    }

    // Watch every text input and textarea in the panel
    document.querySelectorAll('input[type="text"], input[type="url"], input[type="email"], textarea')
        .forEach(el => el.addEventListener('input', () => {
            hasShownUnsavedHint = false; // Reset on each save via saveBtn click
            onFieldChange();
        }));

    // Reset the "has shown" flag after a successful save so it can trigger again
    saveBtn.addEventListener('click', () => {
        hasShownUnsavedHint = false;
    }, { capture: true });
})();

