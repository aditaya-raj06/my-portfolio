/**
 * ==============================================================================
 * GEET'S 60-SECOND GUIDED AUDIO TOUR
 * Interactive Voice-Driven Highlights Tour with Synchronized Auto-Scrolling
 * ==============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initAudioTour();
  });

  function initAudioTour() {
    const heroTourBtn = document.getElementById('hero-audio-tour-btn');

    let currentStep = 0;
    let isTourRunning = false;
    let tourTimeout = null;

    const tourSteps = [
      {
        sectionId: 'hero',
        title: '1/5: Welcome & Introduction',
        text: "Welcome to Aditaya Raj's portfolio! Aditaya is a Computer Science Engineer from Invertis University, Bareilly, building modern full-stack web applications and applied clinical machine learning systems.",
        duration: 11000
      },
      {
        sectionId: 'experience',
        title: '2/5: Invertis University & Education',
        text: "Here is his academic foundation. Aditaya is pursuing his B.Tech in Computer Science and Engineering at Invertis University, following senior secondary training at R.D.S College and secondary schooling at K.C.M.F School.",
        duration: 13000
      },
      {
        sectionId: 'projects',
        title: '3/5: Flagship Projects & ML',
        text: "Among his flagship builds is the clinical Heart Attack Risk Prediction platform estimating cardiac risk telemetry, alongside ML-All, an open-source algorithms suite.",
        duration: 12000
      },
      {
        sectionId: 'skills',
        title: '4/5: Tech Matrix & AI Tools Stack',
        text: "His core engineering stack spans Python, C, Java, and modern JavaScript, accelerated by state-of-the-art AI tools including Claude, ChatGPT, Gemini, and Scikit-Learn.",
        duration: 12000
      },
      {
        sectionId: 'contact',
        title: '5/5: Connect & Book a 15-Min Chat',
        text: "You can book a 15-minute catchup with Aditaya directly using the booking modal, or connect via LinkedIn and GitHub. Enjoy exploring his work!",
        duration: 11000
      }
    ];

    function getIndianFemaleVoice() {
      if (!('speechSynthesis' in window)) return null;
      const voices = window.speechSynthesis.getVoices();

      const namedFemale = voices.find(v => {
        const n = v.name.toLowerCase();
        return n.includes('lekha') || n.includes('tara') || n.includes('swara') || 
               n.includes('heera') || n.includes('neerja') || n.includes('veena');
      });
      if (namedFemale) return namedFemale;

      const taggedFemale = voices.find(v => {
        const n = v.name.toLowerCase();
        const isIndian = v.lang === 'en-IN' || v.lang === 'hi-IN' || n.includes('india');
        return isIndian && (n.includes('female') || (!n.includes('male') && !n.includes('rishi')));
      });
      if (taggedFemale) return taggedFemale;

      const anyIndian = voices.find(v => v.lang === 'hi-IN' || v.lang === 'en-IN');
      if (anyIndian) return anyIndian;

      return voices[0] || null;
    }

    function speakStep(text, onComplete) {
      if (!('speechSynthesis' in window)) {
        if (onComplete) onComplete();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = getIndianFemaleVoice();
      if (voice) utterance.voice = voice;
      utterance.lang = 'en-IN';
      utterance.pitch = 1.08;
      utterance.rate = 1.0;

      utterance.onend = () => {
        if (onComplete) onComplete();
      };

      utterance.onerror = () => {
        if (onComplete) onComplete();
      };

      window.speechSynthesis.speak(utterance);
    }

    function executeStep(stepIndex) {
      if (!isTourRunning || stepIndex >= tourSteps.length) {
        finishTour();
        return;
      }

      currentStep = stepIndex;
      const step = tourSteps[stepIndex];

      // 1. Smooth scroll to target section
      const targetSec = document.getElementById(step.sectionId);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // 2. Update Dynamic Island
      if (window.DynamicIsland) {
        window.DynamicIsland.setTourActive(true, step.title);
      }

      // 3. Update Hero Button text if visible
      if (heroTourBtn) {
        heroTourBtn.innerHTML = `<span>⏹ Stop Tour (${stepIndex + 1}/5)</span>`;
      }

      // 4. Speak narration
      speakStep(step.text, () => {
        if (!isTourRunning) return;
        tourTimeout = setTimeout(() => {
          executeStep(stepIndex + 1);
        }, 1200);
      });
    }

    function startTour() {
      isTourRunning = true;
      currentStep = 0;
      if (window.PortfolioUtils && window.PortfolioUtils.showToast) {
        window.PortfolioUtils.showToast('🎧 Starting 60-Second Guided Tour with Geet...');
      }
      executeStep(0);
    }

    function stopTour() {
      isTourRunning = false;
      if (tourTimeout) clearTimeout(tourTimeout);
      if (window.speechSynthesis) window.speechSynthesis.cancel();

      if (window.DynamicIsland) {
        window.DynamicIsland.setTourActive(false);
      }

      if (heroTourBtn) {
        heroTourBtn.innerHTML = `
          <span class="tour-pulse-dot"></span>
          <span>🎧 Start 60-Sec Audio Tour</span>
        `;
      }

      if (window.PortfolioUtils && window.PortfolioUtils.showToast) {
        window.PortfolioUtils.showToast('Tour paused.');
      }
    }

    function finishTour() {
      isTourRunning = false;
      if (window.DynamicIsland) {
        window.DynamicIsland.setTourActive(false);
      }

      if (heroTourBtn) {
        heroTourBtn.innerHTML = `
          <span class="tour-pulse-dot"></span>
          <span>🎧 Start 60-Sec Audio Tour</span>
        `;
      }

      if (window.PortfolioUtils && window.PortfolioUtils.showToast) {
        window.PortfolioUtils.showToast('✨ 60-Second Tour complete! Feel free to explore.');
      }
    }

    heroTourBtn?.addEventListener('click', () => {
      if (isTourRunning) {
        stopTour();
      } else {
        startTour();
      }
    });

    window.PortfolioAudioTour = {
      startTour,
      stopTour,
      isTourRunning: () => isTourRunning
    };
  }
})();
