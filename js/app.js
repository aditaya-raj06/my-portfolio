/**
 * ==============================================================================
 * MAIN APP CONTROLLER
 * Orchestrates rendering, animations, interactions, copy-to-clipboard, and navigation
 * ==============================================================================
 */

import { portfolioData } from './portfolio-data.js';
import { initRenderer, renderProjects } from './renderer.js';
import { initTerminal } from './terminal.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dynamic data rendering
  initRenderer();
  
  // Initialize interactive terminal
  initTerminal();

  // Initialize interactive features
  initTypingEffect();
  initCategoryFilters();
  initCopyEmail();
  initMobileMenu();
  initActiveNavTracking();
});

/**
 * 1. Typewriter effect for Hero dynamic roles
 */
function initTypingEffect() {
  const typingEl = document.getElementById('typing-role-text');
  if (!typingEl) return;

  const roles = portfolioData.typingRoles || ["Software Engineer", "Problem Solver"];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const pauseEnd = 1800;

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

/**
 * 2. Category filters for Projects showcase
 */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');
      renderProjects(category);
    });
  });
}

/**
 * 3. 1-Click Copy Email with Toast notification
 */
function initCopyEmail() {
  const copyBoxes = document.querySelectorAll('.email-copy-box, .btn-copy-email');
  const toast = document.getElementById('toast-notification');
  const email = portfolioData.personal.email;

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

/**
 * 4. Mobile Menu Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('navbar-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close when clicking any nav link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

/**
 * 5. Track Active Section on Scroll
 */
function initActiveNavTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

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
