(function () {
    'use strict';

    // Check if user is authenticated
    const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
        window.location.href = 'index.html';
        return;
    }

    // Default portfolio data structure
    const defaultData = {
        personal: {
            fullName: 'Buddhika Darshan',
            title: 'BICT Undergraduate | Full-Stack Developer (Java/Spring Boot, React, Laravel) | Data Science Enthusiast | OCI Certified',
            heroTitle: 'I build software that works as good as it looks.',
            heroSubtitle: "I'm Buddhika Darshan. This is my portfolio—projects, skills, and ways to reach me.",
            email: 'buddhikadarshan1475@gmail.com',
            github: 'https://github.com/BuddhikaBICT-UoR-FoT-6',
            linkedin: 'https://www.linkedin.com/in/buddhika-darshan-9b9168252/'
        },
        about: {
            profile: `I am a Full-Stack Developer and BICT Undergraduate with a passion for building software that works as good as it looks. I specialize in Java (Spring Boot), Laravel, and React, with growing expertise in Data Science and Cloud Computing. From developing secure e-commerce platforms to interactive educational tools like Cypher-UI, I love turning complex problems into clean, deployable code.

When I'm not debugging or exploring new tech like Svelte and Microsoft Fabric, I'm refining my skills in cryptography and exploring the potential of the cloud. Open for internships and collaborations.`,
            highlights: [
                'Oracle Certified Foundations Associate (OCI)',
                'Final Year BICT Student at University of Ruhuna',
                'Developed Cypher-UI - Interactive Cryptography Learning Platform',
                'Proficient in Java, Spring Boot, React, Laravel, and Data Science'
            ]
        },
        skills: {
            technical: [
                'Languages: Java, JavaScript, Python',
                'Web: HTML, CSS, REST APIs',
                'Tools: Git/GitHub, VS Code'
            ],
            soft: [
                'Communication',
                'Teamwork',
                'Problem-solving'
            ]
        },
        projects: [
            {
                title: 'Project One',
                badge: 'Web',
                description: 'Short description of the project and the problem it solves.',
                tech: ['HTML', 'CSS', 'JavaScript'],
                liveUrl: '#',
                codeUrl: '#'
            },
            {
                title: 'Project Two',
                badge: 'App',
                description: 'Short description of the project and what you implemented.',
                tech: ['Java', 'SQL', 'Git'],
                liveUrl: '#',
                codeUrl: '#'
            },
            {
                title: 'Project Three',
                badge: 'UI',
                description: 'Short description emphasizing design, UX, or performance improvements.',
                tech: ['Figma', 'CSS', 'Accessibility'],
                liveUrl: '#',
                codeUrl: '#'
            }
        ]
    };

    // Load saved data or use defaults
    let portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || defaultData;

    // DOM Elements
    const saveBtn = document.getElementById('saveBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const successMessage = document.getElementById('successMessage');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const projectsContainer = document.getElementById('projectsContainer');

    // Load data into form
    function loadFormData() {
        // Personal Info
        document.getElementById('fullName').value = portfolioData.personal.fullName;
        document.getElementById('title').value = portfolioData.personal.title;
        document.getElementById('heroTitle').value = portfolioData.personal.heroTitle;
        document.getElementById('heroSubtitle').value = portfolioData.personal.heroSubtitle;
        document.getElementById('email').value = portfolioData.personal.email;
        document.getElementById('github').value = portfolioData.personal.github;
        document.getElementById('linkedin').value = portfolioData.personal.linkedin;

        // About
        document.getElementById('aboutProfile').value = portfolioData.about.profile;
        document.getElementById('aboutHighlights').value = portfolioData.about.highlights.join('\n');

        // Skills
        document.getElementById('technicalSkills').value = portfolioData.skills.technical.join('\n');
        document.getElementById('softSkills').value = portfolioData.skills.soft.join('\n');

        // Projects
        renderProjects();
    }

    // Render projects
    function renderProjects() {
        projectsContainer.innerHTML = '';
        portfolioData.projects.forEach((project, index) => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project-item';
            projectDiv.innerHTML = `
        <h4>Project ${index + 1}</h4>
        <div class="admin-field">
          <label>Title</label>
          <input type="text" class="project-title" data-index="${index}" value="${project.title}">
        </div>
        <div class="admin-field">
          <label>Badge</label>
          <input type="text" class="project-badge" data-index="${index}" value="${project.badge}">
        </div>
        <div class="admin-field">
          <label>Description</label>
          <textarea class="project-description" data-index="${index}">${project.description}</textarea>
        </div>
        <div class="admin-field">
          <label>Technologies (comma separated)</label>
          <input type="text" class="project-tech" data-index="${index}" value="${project.tech.join(', ')}">
        </div>
        <div class="admin-field">
          <label>Live URL</label>
          <input type="url" class="project-live" data-index="${index}" value="${project.liveUrl}">
        </div>
        <div class="admin-field">
          <label>Code URL</label>
          <input type="url" class="project-code" data-index="${index}" value="${project.codeUrl}">
        </div>
        <button class="button button-secondary" onclick="deleteProject(${index})">Delete Project</button>
      `;
            projectsContainer.appendChild(projectDiv);
        });
    }

    // Add new project
    window.deleteProject = function (index) {
        if (confirm('Are you sure you want to delete this project?')) {
            portfolioData.projects.splice(index, 1);
            renderProjects();
        }
    };

    addProjectBtn.addEventListener('click', () => {
        portfolioData.projects.push({
            title: 'New Project',
            badge: 'Web',
            description: 'Project description',
            tech: ['Tech1', 'Tech2'],
            liveUrl: '#',
            codeUrl: '#'
        });
        renderProjects();
    });

    // Save all changes
    saveBtn.addEventListener('click', async () => {
        // Collect personal info
        portfolioData.personal = {
            fullName: document.getElementById('fullName').value,
            title: document.getElementById('title').value,
            heroTitle: document.getElementById('heroTitle').value,
            heroSubtitle: document.getElementById('heroSubtitle').value,
            email: document.getElementById('email').value,
            github: document.getElementById('github').value,
            linkedin: document.getElementById('linkedin').value
        };

        // Collect about
        portfolioData.about = {
            profile: document.getElementById('aboutProfile').value,
            highlights: document.getElementById('aboutHighlights').value.split('\n').filter(h => h.trim())
        };

        // Collect skills
        portfolioData.skills = {
            technical: document.getElementById('technicalSkills').value.split('\n').filter(s => s.trim()),
            soft: document.getElementById('softSkills').value.split('\n').filter(s => s.trim())
        };

        // Collect projects
        const projectTitles = document.querySelectorAll('.project-title');
        const projectBadges = document.querySelectorAll('.project-badge');
        const projectDescriptions = document.querySelectorAll('.project-description');
        const projectTechs = document.querySelectorAll('.project-tech');
        const projectLives = document.querySelectorAll('.project-live');
        const projectCodes = document.querySelectorAll('.project-code');

        portfolioData.projects = [];
        projectTitles.forEach((titleInput, index) => {
            portfolioData.projects.push({
                title: titleInput.value,
                badge: projectBadges[index].value,
                description: projectDescriptions[index].value,
                tech: projectTechs[index].value.split(',').map(t => t.trim()).filter(t => t),
                liveUrl: projectLives[index].value,
                codeUrl: projectCodes[index].value
            });
        });

        // Save to localStorage
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));

        // Try to save to backend
        try {
            const apiBase = typeof window !== 'undefined' ? String(window.PORTFOLIO_API_BASE || '').trim() : '';
            if (apiBase) {
                await fetch(`${apiBase.replace(/\/$/, '')}/api/save-portfolio`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(portfolioData)
                });
            }
        } catch (err) {
            console.log('Backend save failed, using localStorage only:', err);
        }

        // Show success message
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('adminAuth');
        window.location.href = 'index.html';
    });

    // Initialize
    loadFormData();
})();
