/**
 * ==============================================================================
 * GEET - ADITAYA'S INTELLIGENT PORTFOLIO AI ASSISTANT
 * Conversational UI & Client-Side Hybrid Knowledge Engine
 * With Full Voice Mode (Speech-to-Text & Text-to-Speech)
 * ==============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initGeetAssistant();
  });

  function initGeetAssistant() {
    const triggerBtn = document.getElementById('geet-trigger-btn');
    const chatModal = document.getElementById('geet-chat-modal');
    const closeBtn = document.getElementById('geet-close-btn');
    const chatBody = document.getElementById('geet-chat-body');
    const chatForm = document.getElementById('geet-chat-form');
    const chatInput = document.getElementById('geet-chat-input');
    const quickChips = document.querySelectorAll('.geet-quick-chip');
    const micBtn = document.getElementById('geet-mic-btn');
    const audioBtn = document.getElementById('geet-audio-btn');

    if (!triggerBtn || !chatModal) return;

    let isAudioMuted = localStorage.getItem('geet_audio_muted') === 'true';
    let isListening = false;
    let recognition = null;

    // Initialize Audio Toggle state
    updateAudioBtnDisplay();

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        isAudioMuted = !isAudioMuted;
        localStorage.setItem('geet_audio_muted', isAudioMuted);
        updateAudioBtnDisplay();
        if (isAudioMuted && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      });
    }

    function updateAudioBtnDisplay() {
      if (!audioBtn) return;
      const onIcon = audioBtn.querySelector('.audio-icon-on');
      const offIcon = audioBtn.querySelector('.audio-icon-off');
      if (onIcon && offIcon) {
        onIcon.style.display = isAudioMuted ? 'none' : 'inline-block';
        offIcon.style.display = isAudioMuted ? 'inline-block' : 'none';
      }
      audioBtn.setAttribute('title', isAudioMuted ? 'Voice Muted (Click to Unmute)' : 'Voice Enabled (Click to Mute)');
    }

    // Toggle Modal
    triggerBtn.addEventListener('click', () => {
      chatModal.classList.toggle('active');
      if (chatModal.classList.contains('active')) {
        chatInput?.focus();
        scrollChatToBottom();
      }
    });

    closeBtn?.addEventListener('click', () => {
      chatModal.classList.remove('active');
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      stopVoiceRecognition();
    });

    // Quick Prompt Chips
    quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-prompt') || chip.textContent;
        sendMessage(text);
      });
    });

    // Form Submission
    chatForm?.addEventListener('submit', e => {
      e.preventDefault();
      const text = chatInput?.value.trim();
      if (!text) return;
      chatInput.value = '';
      sendMessage(text);
    });

    // =========================================================================
    // VOICE MODE: SPEECH-TO-TEXT (MICROPHONE INPUT)
    // =========================================================================
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English / Hinglish friendly

      recognition.onstart = () => {
        isListening = true;
        micBtn?.classList.add('listening');
        if (chatInput) chatInput.placeholder = 'Listening... Speak now';
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (chatInput) chatInput.value = transcript;
        stopVoiceRecognition();
        if (transcript.trim()) {
          sendMessage(transcript.trim());
          if (chatInput) chatInput.value = '';
        }
      };

      recognition.onerror = (event) => {
        stopVoiceRecognition();
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition warning:', event.error);
        }
      };

      recognition.onend = () => {
        stopVoiceRecognition();
      };
    }

    micBtn?.addEventListener('click', () => {
      if (!recognition) {
        if (window.PortfolioUtils && window.PortfolioUtils.showToast) {
          window.PortfolioUtils.showToast('Speech recognition not supported in this browser.');
        } else {
          alert('Speech recognition is supported in Google Chrome, Safari, and Edge.');
        }
        return;
      }

      if (isListening) {
        stopVoiceRecognition();
      } else {
        try {
          recognition.start();
        } catch (err) {
          stopVoiceRecognition();
        }
      }
    });

    function stopVoiceRecognition() {
      isListening = false;
      micBtn?.classList.remove('listening');
      if (chatInput) chatInput.placeholder = 'Ask Geet or tap mic to speak...';
      try {
        recognition?.stop();
      } catch (e) {}
    }

    // =========================================================================
    // VOICE MODE: TEXT-TO-SPEECH (AUDIO RESPONSE)
    // =========================================================================
    function speakText(rawText) {
      if (isAudioMuted || !('speechSynthesis' in window)) return;

      // Stop previous utterance
      window.speechSynthesis.cancel();

      // Clean markdown, links and emojis for pristine speech output
      const clean = rawText
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/👉|✨|🚀|💻|📄|📬|📧|💼|🐙|📸|🫀|📊|⚡|•/g, '')
        .replace(/\n+/g, '. ')
        .trim();

      if (!clean) return;

      const utterance = new SpeechSynthesisUtterance(clean);

      // Select voice: prioritize Indian English or Hindi if installed, fallback to standard
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        (v.lang === 'en-IN' || v.lang === 'hi-IN') || 
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('lekha')
      ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      utterance.rate = 1.02;
      utterance.pitch = 1.05;

      window.speechSynthesis.speak(utterance);
    }

    // Preload voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    // =========================================================================
    // MESSAGE HANDLING & CHAT ENGINE
    // =========================================================================
    async function sendMessage(userText) {
      // Append user message
      appendMessage('user', userText);

      // Show typing indicator
      const typingEl = showTypingIndicator();

      try {
        let reply = '';

        // Attempt 1: Call Node.js backend
        const res = await fetch('/api/geet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText })
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();
          if (data && data.reply) {
            reply = data.reply;
          }
        }

        // Attempt 2: Client-side NLP fallback if backend is not reachable
        if (!reply) {
          reply = clientSideGeetAnswer(userText);
        }

        // Remove typing indicator & append bot reply
        typingEl?.remove();
        appendMessage('geet', reply);
        speakText(reply);
      } catch (err) {
        typingEl?.remove();
        const fallbackReply = clientSideGeetAnswer(userText);
        appendMessage('geet', fallbackReply);
        speakText(fallbackReply);
      }
    }

    function appendMessage(sender, text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `geet-msg geet-msg-${sender}`;

      const avatar = document.createElement('div');
      avatar.className = 'geet-msg-avatar';
      avatar.textContent = sender === 'user' ? '👤' : '✨';

      const content = document.createElement('div');
      content.className = 'geet-msg-content';
      
      // Format markdown-like bold and links
      let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="geet-inline-link">$1</a>')
        .replace(/\n/g, '<br/>');

      content.innerHTML = formatted;

      msgDiv.appendChild(avatar);
      msgDiv.appendChild(content);
      chatBody.appendChild(msgDiv);
      scrollChatToBottom();
    }

    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'geet-msg geet-msg-geet geet-typing-msg';
      typingDiv.innerHTML = `
        <div class="geet-msg-avatar">✨</div>
        <div class="geet-msg-content geet-typing-bubble">
          <span class="geet-dot"></span>
          <span class="geet-dot"></span>
          <span class="geet-dot"></span>
        </div>
      `;
      chatBody.appendChild(typingDiv);
      scrollChatToBottom();
      return typingDiv;
    }

    function scrollChatToBottom() {
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    /**
     * Client-side NLP Engine (Instant, Zero-Delay, Works Offline)
     */
    function clientSideGeetAnswer(prompt) {
      const q = prompt.toLowerCase();

      if (q.includes('who are you') || q.includes('naam') || q.includes('who is geet') || q.includes('koun')) {
        return `Namaste! Mera naam **Geet** hai. Main Aditaya Raj ki personal AI assistant hoon. Main aapko Aditaya ke projects, skills, background aur contact ke baare me sab bata sakti hoon!`;
      }
      if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('code') || q.includes('repo')) {
        return `Aditaya ke top flagship projects:
1. 🫀 **Heart Attack Risk Prediction System**: Clinical machine learning healthcare platform (Python, Scikit-Learn, Flask, SQLite).
2. 📊 **ML-All**: Open-source machine learning algorithms library.
3. ⚡ **Dynamic Portfolio & Real-Time Sync Engine**: Full-stack application with live GitHub sync and me (Geet)!`;
      }
      if (q.includes('heart') || q.includes('attack') || q.includes('health') || q.includes('medical')) {
        return `Aditaya ka **Heart Attack Risk Prediction System** cardiovascular datasets par trained clinical ML model hai. Ye patient metrics se heart attack probability predict karta hai with real-time web dashboard!
👉 [View GitHub Repo](https://github.com/aditaya-raj06/Heart_Attack_Prediction)`;
      }
      if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language')) {
        return `Aditaya ka technical stack:
• **Languages**: Python, C, Java, JavaScript (ES6+), SQL, HTML5, CSS3/SASS.
• **Web & Backend**: Node.js, Express.js, Flask, RESTful APIs.
• **Databases & Cloud**: PostgreSQL, MySQL, MongoDB, SQLite, Supabase, Vercel, Render.
• **AI/ML**: Scikit-Learn, NumPy, Pandas, Matplotlib, Predictive Analytics.`;
      }
      if (q.includes('resume') || q.includes('cv')) {
        return `Aap Aditaya ka official 1-page PDF resume yahan se download kar sakte hain:
👉 [Download Aditaya's Resume](assets/Aditaya_Raj_Resume.pdf)`;
      }
      if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach') || q.includes('chat') || q.includes('meeting')) {
        return `Aap Aditaya se direct connect kar sakte hain:
📅 **15-Min Quick Call**: Top par "Book 15-Min Call" button dabaiye!
📧 **Email**: [adityarajraja01@gmail.com](mailto:adityarajraja01@gmail.com)
💼 **LinkedIn**: [linkedin.com/in/aditayaraj06](https://linkedin.com/in/aditayaraj06)
🐙 **GitHub**: [github.com/aditaya-raj06](https://github.com/aditaya-raj06)`;
      }
      if (q.includes('education') || q.includes('college') || q.includes('study')) {
        return `Aditaya currently **B.Tech Computer Science & Engineering (Class of 2028 / CSE'28)** pursue kar rahe hain Bareilly, UP se.`;
      }
      return `Main Aditaya Raj ki AI assistant Geet hoon! Aap unke **projects**, **skills** (Python, C, Java, ML), **education** (CSE'28), **resume**, ya **contact channels** ke baare me kuch bhi pooch sakte hain.`;
    }
  }
})();
