/**
 * ==============================================================================
 * 1-CLICK QUICK CHAT SCHEDULER MODAL (15-MIN QUICK CALL)
 * Apple-styled interactive meeting booking controller
 * ==============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initBookingScheduler();
  });

  function initBookingScheduler() {
    const backdrop = document.getElementById('booking-modal-backdrop');
    const closeBtn = document.getElementById('booking-close-btn');
    const cancelBtn = document.getElementById('booking-cancel-btn');
    const bookingForm = document.getElementById('booking-form');
    const topicBtns = document.querySelectorAll('.booking-topic-btn');
    const slotBtns = document.querySelectorAll('.booking-slot-btn');
    const openBtns = document.querySelectorAll('.btn-open-booking');

    let selectedTopic = 'Technical Collaboration';
    let selectedSlot = 'Tomorrow 4:00 PM IST';

    function openModal() {
      if (backdrop) {
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal() {
      if (backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    // Attach open triggers
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    // Click outside dismiss
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });

    // Escape key dismiss
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop?.classList.contains('active')) {
        closeModal();
      }
    });

    // Topic selection
    topicBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        topicBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedTopic = btn.getAttribute('data-topic') || btn.textContent.trim();
      });
    });

    // Slot selection
    slotBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        slotBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedSlot = btn.getAttribute('data-slot') || btn.textContent.trim();
      });
    });

    // Form submission
    bookingForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('booking-submit-btn');
      const nameInput = document.getElementById('booking-name-input');
      const emailInput = document.getElementById('booking-email-input');
      const noteInput = document.getElementById('booking-note-input');

      const name = nameInput?.value.trim();
      const email = emailInput?.value.trim();
      const note = noteInput?.value.trim() || 'No additional note provided.';

      if (!name || !email) {
        if (window.PortfolioUtils && window.PortfolioUtils.showToast) {
          window.PortfolioUtils.showToast('Please provide your name and email.');
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Scheduling...</span>';
      }

      const messageContent = `[15-Min Quick Chat Request]\nTopic: ${selectedTopic}\nPreferred Time: ${selectedSlot}\nName: ${name}\nEmail: ${email}\nNotes: ${note}`;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            email: email,
            subject: `15-Min Quick Chat: ${selectedTopic} with ${name}`,
            message: messageContent
          })
        }).catch(() => null);

        let success = false;
        if (response && response.ok) {
          success = true;
        }

        // Show Toast Feedback
        const toast = document.getElementById('toast-notification');
        if (toast) {
          const msg = toast.querySelector('.toast-msg');
          if (msg) msg.textContent = 'Quick Chat Requested! Aditaya will confirm via email.';
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 4500);
        }

        // Google Calendar shortcut link for convenience
        const calTitle = encodeURIComponent(`15-Min Quick Chat: Aditaya Raj & ${name}`);
        const calDetails = encodeURIComponent(`Discussion Topic: ${selectedTopic}\nRequested Time: ${selectedSlot}\nNotes: ${note}\nOrganizer: adityarajraja01@gmail.com`);
        const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&details=${calDetails}`;

        // Reset form & Close
        bookingForm.reset();
        closeModal();

        // Optional popup prompt to add to calendar
        setTimeout(() => {
          if (confirm('Would you also like to open Google Calendar to save this slot?')) {
            window.open(calUrl, '_blank');
          }
        }, 600);

      } catch (err) {
        if (window.PortfolioUtils && window.PortfolioUtils.showToast) {
          window.PortfolioUtils.showToast('Request noted! Connecting via direct mail.');
        }
        closeModal();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Confirm 15-Min Chat</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          `;
        }
      }
    });
  }
})();
