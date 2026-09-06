/**
 * ==============================================================================
 * DYNAMIC DOM RENDERER
 * Maps data from portfolio-data.js into semantic HTML components cleanly
 * ==============================================================================
 */

import { portfolioData } from './portfolio-data.js';

export function initRenderer() {
  renderProfile();
  renderBento();
  renderProjects('all');
  renderSkills();
  renderTimeline();
  renderSocials();
  initClock();
}

/**
 * Renders Hero & Personal profile data
 */
function renderProfile() {
  const { personal } = portfolioData;

  // Monogram & Name
  const monogramEls = document.querySelectorAll('.data-monogram');
  monogramEls.forEach(el => el.textContent = personal.monogram);

  const nameEls = document.querySelectorAll('.data-name');
  nameEls.forEach(el => el.textContent = personal.name);

  // Availability badge
  const availEl = document.getElementById('hero-availability-text');
  if (availEl) {
    availEl.textContent = personal.availability;
  }

  // Hero Tagline
  const taglineEl = document.getElementById('hero-tagline');
  if (taglineEl) {
    taglineEl.textContent = personal.tagline;
  }

  // Resume button link
  const resumeBtn = document.getElementById('hero-resume-btn');
  if (resumeBtn && personal.resumeUrl) {
    resumeBtn.href = personal.resumeUrl;
  }

  // Email copy target
  const copyEmailEl = document.getElementById('copy-email-address');
  if (copyEmailEl) {
    copyEmailEl.textContent = personal.email;
  }
}

/**
 * Renders Bento Grid Highlights & Stats
 */
function renderBento() {
  const { personal, metrics } = portfolioData;

  // Bio paragraphs
  const bioContainer = document.getElementById('bento-bio-container');
  if (bioContainer) {
    bioContainer.innerHTML = personal.bio
      .map(p => `<p class="bento-bio-text">${p}</p>`)
      .join('');
  }

  // Metric stats
  const statsContainer = document.getElementById('bento-stats-container');
  if (statsContainer) {
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

  // Location
  const locationEl = document.getElementById('clock-location-text');
  if (locationEl) {
    locationEl.textContent = personal.location;
  }
}

/**
 * Updates the live timezone clock in the Bento card
 */
function initClock() {
  const clockEl = document.getElementById('live-clock-display');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    // Format in IST / Asia/Kolkata
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

/**
 * Renders Project Cards with interactive category filtering
 */
export function renderProjects(selectedCategory = 'all') {
  const container = document.getElementById('projects-container');
  if (!container) return;

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

/**
 * Renders Skills Matrix
 */
function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container) return;

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

/**
 * Renders Career & Experience Milestones
 */
function renderTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;

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

/**
 * Binds social links
 */
function renderSocials() {
  const { socials } = portfolioData;

  const githubBtns = document.querySelectorAll('.link-github');
  githubBtns.forEach(btn => (btn.href = socials.github));

  const linkedinBtns = document.querySelectorAll('.link-linkedin');
  linkedinBtns.forEach(btn => (btn.href = socials.linkedin));

  const twitterBtns = document.querySelectorAll('.link-twitter');
  twitterBtns.forEach(btn => (btn.href = socials.twitter));

  const emailBtns = document.querySelectorAll('.link-email');
  emailBtns.forEach(btn => (btn.href = socials.email));
}
