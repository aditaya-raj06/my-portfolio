/**
 * ==============================================================================
 * LIVE GITHUB AUTO-SYNC & CONTACT BACKEND CONNECTOR
 * Synchronizes repositories dynamically and handles real-time messaging
 * ==============================================================================
 */

const GITHUB_USER = 'aditaya-raj06';

/**
 * Initializes real-time synchronization with GitHub and backend
 */
async function initLiveSync(portfolioData, onUpdateCallback) {
  const syncBadge = document.getElementById('sync-status-badge');

  try {
    // 1. First attempt to connect to Node.js backend API
    const backendRes = await fetch('/api/portfolio').catch(() => null);

    if (backendRes && backendRes.ok) {
      const json = await backendRes.json();
      if (json.success && json.data && Array.isArray(json.data.projects)) {
        console.log('[LiveSync] Received live data from Node.js backend:', json.data.projects.length, 'projects');
        
        // Merge live projects into portfolioData
        portfolioData.projects = json.data.projects;
        if (json.data.profile) {
          portfolioData.personal.publicRepos = json.data.profile.publicRepos;
        }

        if (syncBadge) {
          syncBadge.innerHTML = `<span class="sync-dot"></span><span>Live GitHub Sync: Active (${json.data.projects.length} Repos)</span>`;
          syncBadge.style.display = 'inline-flex';
        }

        if (typeof onUpdateCallback === 'function') {
          onUpdateCallback();
        }
        return;
      }
    }

    // 2. Client-side fallback: Direct GitHub Public REST API
    console.log('[LiveSync] Backend not detected. Querying GitHub Public API directly...');
    const ghRes = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`);

    if (ghRes.ok) {
      const repos = await ghRes.json();
      const validRepos = repos.filter(r => r.name !== GITHUB_USER && !r.fork);

      if (validRepos.length > 0) {
        portfolioData.projects = validRepos.map(repo => {
          let category = 'fullstack';
          let categoryLabel = 'Web Engineering';
          const lang = (repo.language || '').toLowerCase();
          const name = repo.name.toLowerCase();

          if (lang === 'python' || name.includes('ml') || name.includes('ai') || name.includes('heart')) {
            category = 'ai-ml';
            categoryLabel = 'Machine Learning & AI';
          } else if (name.includes('cloud') || name.includes('devops')) {
            category = 'cloud-systems';
            categoryLabel = 'Cloud & Systems';
          }

          let image = 'assets/images/project-commerce.svg';
          if (category === 'ai-ml') image = 'assets/images/project-ai.svg';
          else if (category === 'cloud-systems') image = 'assets/images/project-cloud.svg';

          return {
            id: repo.name,
            title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            category,
            categoryLabel,
            description: repo.description || 'Open-source software repository published by Aditaya Raj on GitHub.',
            impact: repo.stargazers_count > 0 ? `⭐ ${repo.stargazers_count} GitHub Stars` : `🚀 Live on GitHub • Updated ${new Date(repo.updated_at).toLocaleDateString()}`,
            technologies: repo.language ? [repo.language, 'Git'] : ['Software'],
            githubUrl: repo.html_url,
            liveUrl: repo.homepage || repo.html_url,
            image
          };
        });

        if (syncBadge) {
          syncBadge.innerHTML = `<span class="sync-dot"></span><span>Live GitHub Sync: Active (${portfolioData.projects.length} Repos)</span>`;
          syncBadge.style.display = 'inline-flex';
        }

        if (typeof onUpdateCallback === 'function') {
          onUpdateCallback();
        }
      }
    }
  } catch (err) {
    console.warn('[LiveSync] Auto-sync skipped or offline:', err.message);
  }
}

/**
 * Initializes Contact Form submission to the backend API
 */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const toast = document.getElementById('toast-notification');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]')?.value.trim() || 'Portfolio Inquiry';
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const resData = await response.json().catch(() => null);

      if (response.ok && resData && resData.success) {
        showToast('Message delivered successfully! Thank you.');
        form.reset();
      } else {
        // Fallback to mailto link
        triggerMailtoFallback(name, email, subject, message);
        showToast('Opening your email client...');
      }
    } catch (err) {
      // Backend offline fallback
      triggerMailtoFallback(name, email, subject, message);
      showToast('Opening your email client...');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    }
  });

  function triggerMailtoFallback(name, email, subject, message) {
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
    const sub = encodeURIComponent(subject);
    window.location.href = `mailto:adityarajraja01@gmail.com?subject=${sub}&body=${body}`;
  }

  function showToast(msg) {
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
}

// Attach globally for standard script execution
if (typeof window !== 'undefined') {
  window.initLiveSync = initLiveSync;
  window.initContactForm = initContactForm;
}
