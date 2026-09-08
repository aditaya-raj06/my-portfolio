/**
 * ==============================================================================
 * APPLE DYNAMIC ISLAND COMPONENT
 * Floating morphing pill with Section Tracking, Siri Audio Waveform, & Tour Control
 * ==============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initDynamicIsland();
  });

  function initDynamicIsland() {
    const island = document.getElementById('dynamic-island');
    const label = document.getElementById('di-label');
    const statusText = document.getElementById('di-status-text');
    const tourBtn = document.getElementById('di-tour-btn');
    const tourBtnText = document.getElementById('di-action-text');

    if (!island || !label) return;

    // Update Bareilly IST time in the Dynamic Island
    function updateISTTime() {
      if (!statusText) return;
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        statusText.textContent = `${timeStr} IST`;
      } catch (e) {
        statusText.textContent = 'Bareilly, IST';
      }
    }

    updateISTTime();
    setInterval(updateISTTime, 30000);

    // Section Scroll Observer to show active viewing section
    const sectionNames = {
      'hero': 'Aditaya Raj • Invertis University',
      'about': 'About • Engineering Philosophy',
      'projects': 'Flagship Projects & AI Models',
      'skills': 'Tech Matrix & AI Tools Stack',
      'experience': 'Invertis University & Milestones',
      'terminal': 'Developer Terminal Console',
      'contact': 'Connect & Book 15-Min Chat'
    };

    let activeSection = 'hero';
    let isSpeaking = false;
    let isTourActive = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isSpeaking && !isTourActive) {
          const id = entry.target.getAttribute('id');
          if (id && sectionNames[id]) {
            activeSection = id;
            label.textContent = sectionNames[id];
            label.style.opacity = '1';
          }
        }
      });
    }, { threshold: 0.35 });

    document.querySelectorAll('section[id]').forEach(sec => observer.observe(sec));

    // Dynamic Island State API exposed on window
    window.DynamicIsland = {
      setSpeaking(speaking, text = '') {
        isSpeaking = speaking;
        if (speaking) {
          island.classList.add('speaking');
          if (text) {
            label.textContent = text;
            label.style.display = 'block';
          }
        } else {
          island.classList.remove('speaking');
          if (!isTourActive) {
            label.textContent = sectionNames[activeSection] || 'Aditaya Raj • Invertis University';
            label.style.display = 'block';
          }
        }
      },

      setTourActive(active, stepTitle = '') {
        isTourActive = active;
        if (active) {
          island.classList.add('tour-active');
          island.classList.add('speaking');
          label.textContent = stepTitle || '🎧 Guided Tour in Progress';
          label.style.display = 'block';
          if (tourBtnText) tourBtnText.textContent = 'Stop Tour';
        } else {
          island.classList.remove('tour-active');
          island.classList.remove('speaking');
          label.textContent = sectionNames[activeSection] || 'Aditaya Raj • Invertis University';
          label.style.display = 'block';
          if (tourBtnText) tourBtnText.textContent = '60s Tour';
        }
      }
    };

    // Clicking Dynamic Island center opens Geet Voice Assistant
    island.addEventListener('click', (e) => {
      // If clicking action button, don't trigger general open
      if (e.target.closest('#di-tour-btn')) return;

      const triggerBtn = document.getElementById('geet-trigger-btn');
      triggerBtn?.click();
    });

    // Tour button inside Dynamic Island
    tourBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.PortfolioAudioTour) {
        if (isTourActive) {
          window.PortfolioAudioTour.stopTour();
        } else {
          window.PortfolioAudioTour.startTour();
        }
      }
    });
  }
})();
