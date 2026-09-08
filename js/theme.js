/**
 * ==============================================================================
 * THEME SWITCHER - APPLE LIGHT / DARK MODE
 * Seamless switching between Apple Signature Light (#fbfbfd) and macOS Dark (#121316)
 * ==============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'aditya_apple_theme';
  const html = document.documentElement;

  // Determine initial theme: stored preference > system preference > default 'light'
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    // Default to light as specifically tuned for Apple clean canvas
    return 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    updateToggleButton(theme);
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  function updateToggleButton(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    const isDark = theme === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to Apple Light Mode' : 'Switch to macOS Dark Mode');
    btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    
    const iconLight = btn.querySelector('.theme-icon-light');
    const iconDark = btn.querySelector('.theme-icon-dark');
    if (iconLight && iconDark) {
      if (isDark) {
        iconLight.style.display = 'inline-block';
        iconDark.style.display = 'none';
      } else {
        iconLight.style.display = 'none';
        iconDark.style.display = 'inline-block';
      }
    }
  }

  function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  }

  // Initial theme setup immediately to avoid flash of wrong theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      updateToggleButton(html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
      toggleBtn.addEventListener('click', toggleTheme);
    }
  });

  // Expose global helper
  window.AppleTheme = {
    getTheme: () => (html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'),
    setTheme: (t) => {
      localStorage.setItem(STORAGE_KEY, t);
      applyTheme(t);
    },
    toggle: toggleTheme
  };
})();
