/**
 * ==============================================================================
 * ADITAYA RAJ - AI DIGITAL TWIN & AUTHENTIC VOICE CLONE
 * First-person Conversational AI Engine with Apple Voice Memo Waveform Player
 * and Natural Indian Male Voice Synthesis Fallback
 * ==============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initAditayaCloneAssistant();
  });

  function initAditayaCloneAssistant() {
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

    let isAudioMuted = localStorage.getItem('aditaya_audio_muted') === 'true';
    let isListening = false;
    let recognition = null;
    let activeAudio = null;

    // Initialize Audio Toggle state
    updateAudioBtnDisplay();

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        isAudioMuted = !isAudioMuted;
        localStorage.setItem('aditaya_audio_muted', isAudioMuted);
        updateAudioBtnDisplay();
        if (isAudioMuted) {
          stopAllAudio();
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

    function stopAllAudio() {
      if (activeAudio) {
        activeAudio.pause();
        activeAudio = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      document.querySelectorAll('.voice-note-bubble.playing').forEach(b => {
        b.classList.remove('playing');
        const playIcon = b.querySelector('.icon-play');
        const pauseIcon = b.querySelector('.icon-pause');
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
      });
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
      stopAllAudio();
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

    // Wire initial static voice note in chat body if present
    wireExistingVoiceNotes();

    // =========================================================================
    // VOICE MODE: SPEECH-TO-TEXT (MICROPHONE INPUT)
    // =========================================================================
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        isListening = true;
        micBtn?.classList.add('listening');
        if (chatInput) chatInput.placeholder = 'Listening to you... Speak now';
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

      recognition.onerror = () => {
        stopVoiceRecognition();
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
        stopAllAudio();
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
      if (chatInput) chatInput.placeholder = 'Ask Aditaya anything or tap mic...';
      try {
        recognition?.stop();
      } catch (e) {}
    }

    // =========================================================================
    // APPLE VOICE MEMO WAVEFORM PLAYER BUILDER
    // =========================================================================
    function createVoiceNoteBubble(audioSrc, title, durationStr) {
      const bubble = document.createElement('div');
      bubble.className = 'voice-note-bubble';

      // Varied height bars for realistic soundwave pattern
      const barHeights = [8, 14, 18, 12, 22, 16, 10, 20, 14, 18, 22, 12, 16, 20, 8, 14, 18, 10, 16, 8];
      const barsHtml = barHeights.map(h => `<span class="vn-bar" style="height: ${h}px;"></span>`).join('');

      bubble.innerHTML = `
        <div class="voice-note-header">
          <span class="vn-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path></svg>
            Aditaya's Voice Note
          </span>
          <span style="font-size: 0.68rem; color: var(--text-muted);">${title || 'Audio Note'}</span>
        </div>
        <div class="voice-note-player">
          <button type="button" class="vn-play-btn" aria-label="Play Voice Note">
            <svg class="icon-play" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <svg class="icon-pause" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          </button>
          <div class="vn-waveform">${barsHtml}</div>
          <span class="vn-time">${durationStr || '0:14'}</span>
        </div>
      `;

      attachAudioToBubble(bubble, audioSrc, durationStr);
      return bubble;
    }

    function attachAudioToBubble(bubble, audioSrc, defaultDuration) {
      const playBtn = bubble.querySelector('.vn-play-btn');
      const playIcon = bubble.querySelector('.icon-play');
      const pauseIcon = bubble.querySelector('.icon-pause');
      const timeEl = bubble.querySelector('.vn-time');

      const audio = new Audio(audioSrc);

      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration && !isNaN(audio.duration)) {
          const m = Math.floor(audio.duration / 60);
          const s = Math.floor(audio.duration % 60).toString().padStart(2, '0');
          timeEl.textContent = `${m}:${s}`;
        }
      });

      audio.addEventListener('play', () => {
        bubble.classList.add('playing');
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
      });

      audio.addEventListener('pause', () => {
        bubble.classList.remove('playing');
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
      });

      audio.addEventListener('ended', () => {
        bubble.classList.remove('playing');
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (audio.duration) {
          const m = Math.floor(audio.duration / 60);
          const s = Math.floor(audio.duration % 60).toString().padStart(2, '0');
          timeEl.textContent = `${m}:${s}`;
        }
      });

      audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
          const rem = Math.max(0, audio.duration - audio.currentTime);
          const m = Math.floor(rem / 60);
          const s = Math.floor(rem % 60).toString().padStart(2, '0');
          timeEl.textContent = `${m}:${s}`;
        }
      });

      playBtn?.addEventListener('click', () => {
        if (audio.paused) {
          stopAllAudio();
          activeAudio = audio;
          audio.play().catch(e => console.warn('Audio play error:', e));
        } else {
          audio.pause();
          activeAudio = null;
        }
      });
    }

    function wireExistingVoiceNotes() {
      document.querySelectorAll('.voice-note-bubble').forEach(bubble => {
        const audioSrc = bubble.getAttribute('data-src') || 'assets/audio/welcome.m4a';
        const duration = bubble.getAttribute('data-duration') || '0:14';
        attachAudioToBubble(bubble, audioSrc, duration);
      });
    }

    // =========================================================================
    // VOICE MODE: TEXT-TO-SPEECH (NATURAL INDIAN MALE VOICE TUNING)
    // =========================================================================
    function speakText(rawText) {
      if (isAudioMuted || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();

      const clean = rawText
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/👉|✨|🚀|💻|📄|📬|📧|💼|🐙|📸|🫀|📊|⚡|•/g, '')
        .replace(/\n+/g, '. ')
        .trim();

      if (!clean) return;

      const utterance = new SpeechSynthesisUtterance(clean);

      // Select natural Indian male developer voice
      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(v => 
        v.name.toLowerCase().includes('rishi') ||
        v.name.toLowerCase().includes('aman') ||
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('ravi')
      ) || voices.find(v => v.lang === 'en-IN' || v.lang === 'hi-IN') 
        || voices.find(v => v.lang.startsWith('en')) 
        || voices[0];

      if (maleVoice) {
        utterance.voice = maleVoice;
      }
      utterance.rate = 0.98;
      utterance.pitch = 0.94; // Authentic deeper male pitch

      window.speechSynthesis.speak(utterance);
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    // =========================================================================
    // MESSAGE HANDLING & FIRST-PERSON CONVERSATIONAL ENGINE
    // =========================================================================
    async function sendMessage(userText) {
      stopAllAudio();
      appendMessage('user', userText);

      const typingEl = showTypingIndicator();

      try {
        let reply = '';
        let voiceNoteInfo = null;

        // Check local first-person knowledge match first
        const localMatch = firstPersonAditayaAnswer(userText);
        reply = localMatch.text;
        voiceNoteInfo = localMatch.voiceNote;

        // If backend responds, check if it provides an enriched answer
        const res = await fetch('/api/geet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText })
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();
          if (data && data.reply && !voiceNoteInfo) {
            reply = data.reply;
          }
        }

        typingEl?.remove();
        appendMessage('geet', reply, voiceNoteInfo);

        // If a voice note is attached, play it directly or let user click;
        // if no pre-recorded voice note, speak using tuned male speech synthesis
        if (voiceNoteInfo && !isAudioMuted) {
          // Play the authentic pre-recorded audio note
          const latestBubble = chatBody.querySelector('.voice-note-bubble:last-of-type .vn-play-btn');
          latestBubble?.click();
        } else if (!voiceNoteInfo && !isAudioMuted) {
          speakText(reply);
        }
      } catch (err) {
        typingEl?.remove();
        const fallback = firstPersonAditayaAnswer(userText);
        appendMessage('geet', fallback.text, fallback.voiceNote);
        if (fallback.voiceNote && !isAudioMuted) {
          const latestBubble = chatBody.querySelector('.voice-note-bubble:last-of-type .vn-play-btn');
          latestBubble?.click();
        } else if (!fallback.voiceNote && !isAudioMuted) {
          speakText(fallback.text);
        }
      }
    }

    function appendMessage(sender, text, voiceNoteInfo) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `geet-msg geet-msg-${sender}`;

      const avatar = document.createElement('div');
      avatar.className = 'geet-msg-avatar';
      avatar.textContent = sender === 'user' ? '👤' : '⚡';

      const content = document.createElement('div');
      content.className = 'geet-msg-content';
      
      let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="geet-inline-link">$1</a>')
        .replace(/\n/g, '<br/>');

      content.innerHTML = formatted;

      // If voice note attached, append interactive waveform player inside the bubble
      if (voiceNoteInfo) {
        const vnEl = createVoiceNoteBubble(voiceNoteInfo.src, voiceNoteInfo.title, voiceNoteInfo.duration);
        content.appendChild(vnEl);
      }

      msgDiv.appendChild(avatar);
      msgDiv.appendChild(content);
      chatBody.appendChild(msgDiv);
      scrollChatToBottom();
    }

    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'geet-msg geet-msg-geet geet-typing-msg';
      typingDiv.innerHTML = `
        <div class="geet-msg-avatar">⚡</div>
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
     * Authentic 1st-Person Knowledge Engine (Directly speaking as Aditaya Raj)
     */
    function firstPersonAditayaAnswer(prompt) {
      const q = prompt.toLowerCase();

      if (q.includes('who are you') || q.includes('naam') || q.includes('who is aditaya') || q.includes('koun') || q.includes('intro')) {
        return {
          text: `Hey! Main **Aditaya Raj** hoon. Ye mera interactive AI digital twin aur voice clone hai. Aap mujhse mere **machine learning projects**, **technical skills**, meri coding journey ya collaboration ke bare me direct pooch sakte ho!`,
          voiceNote: { src: 'assets/audio/welcome.m4a', title: 'Aditaya\'s Introduction', duration: '0:14' }
        };
      }

      if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('code') || q.includes('repo')) {
        return {
          text: `Mere top flagship projects:
1. 🫀 **Heart Attack Risk Prediction System**: Cardiovascular clinical dataset par trained model jo real-time patient metrics se heart attack probability accurately predict karta hai.
2. 📊 **ML-All**: Open-source machine learning algorithms library.
3. ⚡ **Dynamic Portfolio & Live Sync Engine**: Ye portfolio website jisme live GitHub sync aur mera voice clone integrated hai!`,
          voiceNote: { src: 'assets/audio/projects.m4a', title: 'Flagship Projects Overview', duration: '0:16' }
        };
      }

      if (q.includes('heart') || q.includes('attack') || q.includes('health') || q.includes('medical')) {
        return {
          text: `Mera **Heart Attack Risk Prediction System** clinical parameters (cholesterol, heart rate, blood pressure, etc.) evaluate karke probability calculate karta hai with 87%+ accuracy!
👉 [View Repository on GitHub](https://github.com/aditaya-raj06/Heart_Attack_Prediction)`,
          voiceNote: null
        };
      }

      if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language')) {
        return {
          text: `Mera core technical skill stack:
• **Languages**: Python, C, Java, JavaScript (ES6+), SQL, HTML5, CSS3.
• **Machine Learning & Data**: Scikit-Learn, NumPy, Pandas, Matplotlib, Predictive Analytics.
• **Web & Backend**: Node.js, Express.js, Flask, RESTful APIs.
• **Tools & Systems**: Git, GitHub, Supabase, PostgreSQL, SQLite, Vercel, Render.`,
          voiceNote: { src: 'assets/audio/skills.m4a', title: 'Technical Stack & Expertise', duration: '0:13' }
        };
      }

      if (q.includes('resume') || q.includes('cv')) {
        return {
          text: `Aap mera verified 1-page PDF resume yahan se download kar sakte ho:
👉 [Download Aditaya's Resume](assets/Aditaya_Raj_Resume.pdf)`,
          voiceNote: null
        };
      }

      if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach') || q.includes('chat') || q.includes('meeting')) {
        return {
          text: `Aap mujhse directly connect kar sakte ho:
📅 **15-Min Quick Chat**: Top par **'Book 15-Min Call'** button daba kar slot select karo!
📧 **Email**: [adityarajraja01@gmail.com](mailto:adityarajraja01@gmail.com)
💼 **LinkedIn**: [linkedin.com/in/aditayaraj06](https://linkedin.com/in/aditayaraj06)
🐙 **GitHub**: [github.com/aditaya-raj06](https://github.com/aditaya-raj06)`,
          voiceNote: null
        };
      }

      if (q.includes('education') || q.includes('college') || q.includes('study')) {
        return {
          text: `Main currently **B.Tech Computer Science & Engineering (Class of 2028 / CSE'28)** pursue kar raha hoon Bareilly, Uttar Pradesh se.`,
          voiceNote: null
        };
      }

      return {
        text: `Hey! Main Aditaya Raj hoon. Aap mujhse mere **projects**, **machine learning work**, **skills** (Python, C, Java, ML), **resume**, ya **internship/hiring opportunities** ke baare me kuch bhi direct pooch sakte ho!`,
        voiceNote: null
      };
    }
  }
})();
