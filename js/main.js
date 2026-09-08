/**
 * ==============================================================================
 * PORTFOLIO APPLICATION RUNTIME (Universal support for http:// and file://)
 * ==============================================================================
 */

(function () {
  'use strict';

  // Fallback data in case portfolioData is loaded asynchronously
  const data = window.portfolioData || {};

  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });

  function initApp() {
    const portfolioData = window.portfolioData || data;

    renderProfile(portfolioData);
    renderBento(portfolioData);
    renderProjects(portfolioData, 'all');
    renderSkills(portfolioData);
    renderAITools(portfolioData);
    renderTimeline(portfolioData);
    renderSocials(portfolioData);
    initClock();

    initTypingEffect(portfolioData);
    initCategoryFilters(portfolioData);
    initCopyEmail(portfolioData);
    initMobileMenu();
    initActiveNavTracking();
    initTerminal(portfolioData);

    // Initialize dynamic contact form
    if (typeof window.initContactForm === 'function') {
      window.initContactForm();
    }

    // Initialize real-time GitHub live sync
    if (typeof window.initLiveSync === 'function') {
      window.initLiveSync(portfolioData, () => {
        renderProjects(portfolioData, 'all');
      });
    }
  }

  // --------------------------------------------------------------------------
  // 1. Render Hero & Profile
  // --------------------------------------------------------------------------
  function renderProfile(portfolioData) {
    if (!portfolioData.personal) return;
    const { personal } = portfolioData;

    document.querySelectorAll('.data-monogram').forEach(el => el.textContent = personal.monogram || 'AR');
    document.querySelectorAll('.data-name').forEach(el => el.textContent = personal.name || 'Aditya Raj');

    const availEl = document.getElementById('hero-availability-text');
    if (availEl) availEl.textContent = personal.availability;

    const taglineEl = document.getElementById('hero-tagline');
    if (taglineEl) taglineEl.textContent = personal.tagline;

    const resumeBtn = document.getElementById('hero-resume-btn');
    if (resumeBtn && personal.resumeUrl) resumeBtn.href = personal.resumeUrl;

    const copyEmailEl = document.getElementById('copy-email-address');
    if (copyEmailEl) copyEmailEl.textContent = personal.email;
  }

  // --------------------------------------------------------------------------
  // 2. Render Bento Grid
  // --------------------------------------------------------------------------
  function renderBento(portfolioData) {
    const { personal, metrics } = portfolioData;
    if (!personal) return;

    const bioContainer = document.getElementById('bento-bio-container');
    if (bioContainer && personal.bio) {
      bioContainer.innerHTML = personal.bio
        .map(p => `<p class="bento-bio-text">${p}</p>`)
        .join('');
    }

    const statsContainer = document.getElementById('bento-stats-container');
    if (statsContainer && metrics) {
      statsContainer.innerHTML = metrics
        .map(
          m => `
          <div class="stat-box">
            <div class="stat-number">${m.number}</div>
            <div class="stat-label">${m.label}</div>
          </div>
        `
        )
        .join('');
    }

    const locationEl = document.getElementById('clock-location-text');
    if (locationEl) locationEl.textContent = personal.location || 'Bengaluru / Remote';
  }

  // --------------------------------------------------------------------------
  // 3. Live Clock Widget
  // --------------------------------------------------------------------------
  function initClock() {
    const clockEl = document.getElementById('live-clock-display');
    if (!clockEl) return;

    function update() {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      clockEl.textContent = now.toLocaleTimeString('en-US', options) + ' IST';
    }

    update();
    setInterval(update, 1000);
  }

  // --------------------------------------------------------------------------
  // 4. Render Project Cards with Filter
  // --------------------------------------------------------------------------
  function renderProjects(portfolioData, selectedCategory = 'all') {
    const container = document.getElementById('projects-container');
    if (!container || !portfolioData.projects) return;

    const filtered =
      selectedCategory === 'all'
        ? portfolioData.projects
        : portfolioData.projects.filter(p => p.category === selectedCategory);

    container.innerHTML = filtered
      .map(
        project => `
        <article class="project-card" data-category="${project.category}">
          <div class="project-media">
            <img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy" />
            <span class="project-tag-pill">${project.categoryLabel}</span>
          </div>
          <div class="project-content">
            <div class="project-header-row">
              <h3 class="project-title">${project.title}</h3>
            </div>
            <p class="project-desc">${project.description}</p>
            
            <div class="project-impact-box">
              <span class="impact-icon">💡</span>
              <span class="impact-text">${project.impact}</span>
            </div>

            <div class="project-tech-stack">
              ${project.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>

            <div class="project-actions">
              ${
                project.liveUrl
                  ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                      <span>Live Preview</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                     </a>`
                  : ''
              }
              ${
                project.githubUrl
                  ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                      <span>Source Code</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                     </a>`
                  : ''
              }
            </div>
          </div>
        </article>
      `
      )
      .join('');
  }

  // --------------------------------------------------------------------------
  // 5. Render Skills Matrix
  // --------------------------------------------------------------------------
  function renderSkills(portfolioData) {
    const container = document.getElementById('skills-container');
    if (!container || !portfolioData.skills) return;

    container.innerHTML = portfolioData.skills
      .map(
        cat => `
        <div class="skill-category-card">
          <div class="skill-cat-title">
            <span class="skill-cat-icon">✦</span>
            <span>${cat.category}</span>
          </div>
          <div class="skill-items-list">
            ${cat.items
              .map(
                item => `
              <div class="skill-item">
                <div class="skill-meta">
                  <span class="skill-name">${item.name}</span>
                  <span class="skill-level">${item.level}</span>
                </div>
                <div class="skill-progress-bar">
                  <div class="skill-progress-fill" style="width: ${item.percentage}%"></div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `
      )
      .join('');
  }

  // --------------------------------------------------------------------------
  // 5.1 Render Real-World AI Tools Stack
  // --------------------------------------------------------------------------
  function renderAITools(portfolioData) {
    const container = document.getElementById('ai-tools-container');
    if (!container || !portfolioData.aiTools) return;

    const iconSvgs = {
      claude: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13.5 3L12 8.5L10.5 3L8 4L10 9L4.5 7.5L4 10L9.5 11.5L4 13L4.5 15.5L10 14L8 19L10.5 20L12 14.5L13.5 20L16 19L14 14L19.5 15.5L20 13L14.5 11.5L20 10L19.5 7.5L14 9L16 4L13.5 3Z" fill="#D97706"/></svg>`,
      openai: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 2a10 10 0 0 0-7.07 17.07l1.41-1.41A8 8 0 1 1 12 4V2z"></path><path d="M22 12a10 10 0 0 0-17.07-7.07l1.41 1.41A8 8 0 1 1 20 12h2z"></path></svg>`,
      gemini: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" fill="url(#geminiGradient)"/><defs><linearGradient id="geminiGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="#4E95ED"/><stop offset="0.5" stop-color="#9965F4"/><stop offset="1" stop-color="#E879F9"/></linearGradient></defs></svg>`,
      sklearn: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="18" r="3"></circle><line x1="9" y1="6" x2="15" y2="6"></line><line x1="6" y1="9" x2="6" y2="15"></line><line x1="18" y1="9" x2="18" y2="15"></line><line x1="9" y1="18" x2="15" y2="18"></line><line x1="8" y1="8" x2="16" y2="16"></line></svg>`,
      speech: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0071E3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,
      copilot: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"></path></svg>`,
      huggingface: `<span style="font-size: 1.35rem; line-height: 1;">🤗</span>`,
      cursor: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EC4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7 18 3-7 7-3L3 3z"></path><path d="M13 13l6 6"></path></svg>`
    };

    container.innerHTML = portfolioData.aiTools
      .map(
        tool => `
        <div class="ai-tool-card">
          <div class="ai-tool-header-row">
            <div class="ai-tool-icon-box">
              ${iconSvgs[tool.icon] || '🤖'}
            </div>
            <span class="ai-tool-badge">${tool.badge}</span>
          </div>
          <div>
            <div class="ai-tool-name">${tool.name}</div>
            <div class="ai-tool-tagline">${tool.tagline}</div>
          </div>
          <p class="ai-tool-usecase">${tool.useCase}</p>
        </div>
      `
      )
      .join('');
  }

  // --------------------------------------------------------------------------
  // 6. Render Experience Timeline
  // --------------------------------------------------------------------------
  function renderTimeline(portfolioData) {
    const container = document.getElementById('timeline-container');
    if (!container || !portfolioData.experience) return;

    container.innerHTML = portfolioData.experience
      .map(
        exp => `
        <div class="timeline-item">
          <div class="timeline-node"></div>
          <div class="timeline-card">
            <div class="timeline-header">
              <h3 class="timeline-role">${exp.role}</h3>
              <span class="timeline-period">${exp.period}</span>
            </div>
            <div class="timeline-company">${exp.company} • <span style="color: var(--text-muted)">${exp.location}</span></div>
            <ul class="timeline-bullets">
              ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        </div>
      `
      )
      .join('');
  }

  // --------------------------------------------------------------------------
  // 7. Render Social Links
  // --------------------------------------------------------------------------
  function renderSocials(portfolioData) {
    if (!portfolioData.socials) return;
    const { socials } = portfolioData;

    document.querySelectorAll('.link-github').forEach(btn => (btn.href = socials.github || '#'));
    document.querySelectorAll('.link-linkedin').forEach(btn => (btn.href = socials.linkedin || '#'));
    document.querySelectorAll('.link-instagram').forEach(btn => (btn.href = socials.instagram || '#'));
    document.querySelectorAll('.link-twitter').forEach(btn => (btn.href = socials.twitter || '#'));
    document.querySelectorAll('.link-email').forEach(btn => (btn.href = socials.email || '#'));
  }

  // --------------------------------------------------------------------------
  // 8. Typewriter Effect
  // --------------------------------------------------------------------------
  function initTypingEffect(portfolioData) {
    const typingEl = document.getElementById('typing-role-text');
    if (!typingEl) return;

    const roles = portfolioData.typingRoles || ['Software Engineer', 'Problem Solver'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseEnd = 2000;

    function type() {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        typingEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
          isDeleting = true;
          setTimeout(type, pauseEnd);
          return;
        }
      } else {
        typingEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }

      setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
    }

    type();
  }

  // --------------------------------------------------------------------------
  // 9. Category Filter Buttons
  // --------------------------------------------------------------------------
  function initCategoryFilters(portfolioData) {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');
        renderProjects(portfolioData, category);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. Copy Email Toast
  // --------------------------------------------------------------------------
  function initCopyEmail(portfolioData) {
    const copyBoxes = document.querySelectorAll('.email-copy-box, .btn-copy-email');
    const toast = document.getElementById('toast-notification');
    const email = (portfolioData.personal && portfolioData.personal.email) || 'adityaraj.dev@example.com';

    copyBoxes.forEach(box => {
      box.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(email);
          showToast(`Copied to clipboard: ${email}`);
        } catch (err) {
          showToast(`Email: ${email}`);
        }
      });
    });

    function showToast(msg) {
      if (!toast) return;
      toast.querySelector('.toast-msg').textContent = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3200);
    }
  }

  // --------------------------------------------------------------------------
  // 11. Mobile Menu
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('navbar-links');

    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 12. Active Nav Link Tracking
  // --------------------------------------------------------------------------
  function initActiveNavTracking() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = '';
      const scrollPos = window.scrollY + 140;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 13. Interactive Terminal Console
  // --------------------------------------------------------------------------
  function initTerminal(portfolioData) {
    const terminalInput = document.getElementById('terminal-cli-input');
    const terminalBody = document.getElementById('terminal-output-area');
    const termChips = document.querySelectorAll('.term-chip');

    if (!terminalInput || !terminalBody) return;

    const name = (portfolioData.personal && portfolioData.personal.name) || 'Aditya Raj';
    printLine(
      `Welcome to <span style="color: var(--accent-cyan); font-weight: bold;">${name}'s Interactive CLI v2.4</span>. Type <span style="color: #f59e0b;">'help'</span> to explore available commands.`
    );

    terminalInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const command = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';
        if (command) {
          handleCommand(command);
        }
      }
    });

    termChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          handleCommand(cmd);
        }
      });
    });

    function handleCommand(cmd) {
      printPrompt(cmd);

      switch (cmd) {
        case 'help':
          printLine(`
Available commands:
  <span style="color: #38bdf8;">about</span>     - Summary of background and engineering focus
  <span style="color: #38bdf8;">skills</span>    - Core technical stack and proficiencies
  <span style="color: #38bdf8;">projects</span>  - Highlights of flagship production apps
  <span style="color: #38bdf8;">contact</span>   - Direct contact channels & booking
  <span style="color: #38bdf8;">whoami</span>    - Prints current guest session info
  <span style="color: #38bdf8;">clear</span>     - Clears the terminal screen
          `);
          break;

        case 'about':
          printLine(`
<span style="color: #a855f7; font-weight: bold;">${portfolioData.personal.name}</span> - ${portfolioData.personal.title}
📍 Location: ${portfolioData.personal.location}
🟢 Status: ${portfolioData.personal.availability}

${portfolioData.personal.tagline}
          `);
          break;

        case 'skills':
          const skillsSummary = (portfolioData.skills || [])
            .map(
              cat =>
                `  <span style="color: #06b6d4;">[${cat.category}]</span>\n  ${cat.items
                  .map(i => `${i.name} (${i.level})`)
                  .join(', ')}`
            )
            .join('\n\n');
          printLine(`\n${skillsSummary}\n`);
          break;

        case 'projects':
          const projectSummary = (portfolioData.projects || [])
            .map(
              p =>
                `  🚀 <span style="color: #f8fafc; font-weight: bold;">${p.title}</span>\n     ${p.impact}\n     Tech: ${p.technologies.join(', ')}`
            )
            .join('\n\n');
          printLine(`\n${projectSummary}\n`);
          break;

        case 'contact':
          printLine(`
📧 Email: <span style="color: #10b981;">${portfolioData.personal?.email || 'N/A'}</span>
🐙 GitHub: ${portfolioData.socials?.github || '#'}
💼 LinkedIn: ${portfolioData.socials?.linkedin || '#'}
📸 Instagram: ${portfolioData.socials?.instagram || '#'}
🐦 Twitter/X: ${portfolioData.socials?.twitter || '#'}
          `);
          break;

        case 'whoami':
          printLine(`guest@visitor-session: active (Permission level: read-only)`);
          break;

        case 'sudo':
          printLine(`Permission denied: You need Aditya's root SSH keys for that! 😉`);
          break;

        case 'clear':
          terminalBody.innerHTML = '';
          break;

        default:
          printLine(
            `Command not recognized: '<span style="color: #ef4444;">${cmd}</span>'. Type <span style="color: #f59e0b;">'help'</span> for a list of valid commands.`
          );
          break;
      }

      const wrapper = terminalBody.parentElement;
      if (wrapper) wrapper.scrollTop = wrapper.scrollHeight;
    }

    function printPrompt(cmd) {
      const p = document.createElement('div');
      p.innerHTML = `<span style="color: var(--accent-cyan);">visitor@portfolio:~$</span> <span style="color: #ffffff;">${cmd}</span>`;
      terminalBody.appendChild(p);
    }

    function printLine(html) {
      const div = document.createElement('div');
      div.style.marginBottom = '0.75rem';
      div.innerHTML = html.replace(/\n/g, '<br/>');
      terminalBody.appendChild(div);
    }
  }
})();
