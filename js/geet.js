/**
 * ==============================================================================
 * GEET - ADITAYA RAJ'S BILINGUAL VOICE AI ASSISTANT
 * Indian Female Voice Synthesis with Full Hinglish & English Conversational Engine
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
      audioBtn.setAttribute('title', isAudioMuted ? 'Voice Output Muted (Click to Enable)' : 'Voice Output Enabled (Click to Mute)');
    }

    function stopAllSpeech() {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
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
      stopAllSpeech();
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
      recognition.lang = 'en-IN'; // Indian English / Hinglish

      recognition.onstart = () => {
        isListening = true;
        micBtn?.classList.add('listening');
        if (chatInput) chatInput.placeholder = 'Listening... Speak in English or Hinglish';
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
        stopAllSpeech();
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
      if (chatInput) chatInput.placeholder = 'Ask Geet in English or Hinglish...';
      try {
        recognition?.stop();
      } catch (e) {}
    }

    // =========================================================================
    // VOICE MODE: TEXT-TO-SPEECH (INDIAN FEMALE VOICE TUNING)
    // =========================================================================
    function getIndianFemaleVoice() {
      if (!('speechSynthesis' in window)) return null;
      const voices = window.speechSynthesis.getVoices();

      // Priority 1: Named Indian Female Voices (Lekha, Tara, Swara, Heera, Neerja, Veena)
      const namedFemale = voices.find(v => {
        const n = v.name.toLowerCase();
        return n.includes('lekha') || n.includes('tara') || n.includes('swara') || 
               n.includes('heera') || n.includes('neerja') || n.includes('veena');
      });
      if (namedFemale) return namedFemale;

      // Priority 2: Indian English / Hindi Voices marked female
      const taggedFemale = voices.find(v => {
        const n = v.name.toLowerCase();
        const isIndian = v.lang === 'en-IN' || v.lang === 'hi-IN' || n.includes('india');
        return isIndian && (n.includes('female') || !n.includes('male') && !n.includes('rishi') && !n.includes('aman'));
      });
      if (taggedFemale) return taggedFemale;

      // Priority 3: Any Hindi or Indian English voice
      const anyIndian = voices.find(v => v.lang === 'hi-IN' || v.lang === 'en-IN' || v.name.toLowerCase().includes('india'));
      if (anyIndian) return anyIndian;

      // Priority 4: Any pleasant female English voice
      const anyFemale = voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('karen'));
      if (anyFemale) return anyFemale;

      return voices[0] || null;
    }

    function speakText(rawText) {
      if (isAudioMuted || !('speechSynthesis' in window)) return;

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
      const femaleVoice = getIndianFemaleVoice();

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      // Detect if utterance has Hindi/Hinglish content for appropriate pronunciation
      if (isHindiOrHinglish(clean)) {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }

      // Warm, natural Indian female voice tuning
      utterance.pitch = 1.08; // Friendly, warm female pitch
      utterance.rate = 1.0;   // Natural conversational speed

      window.speechSynthesis.speak(utterance);
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    // =========================================================================
    // LANGUAGE DETECTION HELPER (Hinglish vs English)
    // =========================================================================
    function isHindiOrHinglish(text) {
      if (/[\u0900-\u097F]/.test(text)) return true;
      const hindiKeywords = [
        'kya', 'hai', 'hain', 'kaise', 'kaun', 'koun', 'batao', 'mera', 'meri', 'mere',
        'aap', 'tum', 'namaste', 'shukriya', 'aur', 'kuch', 'bhi', 'kahan', 'kab',
        'kyu', 'kyun', 'nahi', 'haan', 'acha', 'theek', 'padhai', 'college', 'kitna',
        'chahiye', 'karna', 'karta', 'karti', 'hoga', 'hogi', 'kaam', 'baare', 'bataiye',
        'unka', 'unke', 'unki', 'bata'
      ];
      const lower = (text || '').toLowerCase();
      return hindiKeywords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(lower));
    }

    // =========================================================================
    // MESSAGE HANDLING & CHAT ENGINE
    // =========================================================================
    async function sendMessage(userText) {
      stopAllSpeech();
      appendMessage('user', userText);

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

        // Attempt 2: Local bilingual NLP fallback if backend is unreachable
        if (!reply) {
          reply = clientSideGeetAnswer(userText);
        }

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
     * Bilingual Client-side Knowledge Engine for Geet (Hinglish & English)
     */
    function clientSideGeetAnswer(prompt) {
      const q = prompt.toLowerCase();
      const inHindi = isHindiOrHinglish(prompt);

      // Identity
      if (q.includes('who are you') || q.includes('naam') || q.includes('who is geet') || q.includes('koun') || q.includes('intro')) {
        if (inHindi) {
          return `Namaste! Mera naam **Geet** hai. Main Aditaya Raj ki AI voice assistant hoon. Main aapke sath **Hinglish** aur **English** dono me baat kar sakti hoon! Aap Aditaya ke projects, skills, background aur contact details ke bare me kuch bhi pooch sakte hain.`;
        }
        return `Hello! My name is **Geet**, Aditaya Raj's AI voice assistant. I can converse fluently in both **English** and **Hinglish**. Feel free to ask me anything about Aditaya's projects, technical skills, background, or how to contact him!`;
      }

      // Projects
      if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('code') || q.includes('repo') || q.includes('kaam')) {
        if (inHindi) {
          return `Aditaya ke top flagship projects:
1. 🫀 **Heart Attack Risk Prediction System**: Clinical machine learning healthcare platform jo patient health parameters se cardiovascular risk calculate karta hai (Python, Scikit-Learn, Flask, SQLite).
2. 📊 **ML-All**: Open-source machine learning algorithms library.
3. ⚡ **Dynamic Portfolio & Live Sync Engine**: High-impact full-stack application backed by Node.js, live GitHub webhooks, aur meri voice!`;
        }
        return `Here are Aditaya's flagship projects:
1. 🫀 **Heart Attack Risk Prediction System**: A clinical predictive ML platform estimating cardiovascular risk probabilities from patient telemetry (Python, Scikit-Learn, Flask, SQLite).
2. 📊 **ML-All**: An open-source machine learning algorithm suite implementing regression, classification, and evaluation pipelines.
3. ⚡ **Dynamic Portfolio & Real-Time Sync Engine**: Full-stack application backed by Node.js, live GitHub auto-sync, and my voice!`;
      }

      // Heart Attack Project
      if (q.includes('heart') || q.includes('attack') || q.includes('health') || q.includes('medical') || q.includes('cardio')) {
        if (inHindi) {
          return `Aditaya ka **Heart Attack Risk Prediction System** cardiovascular datasets par trained clinical ML model hai jo cholesterol, blood pressure aur heart rate evaluate karke real-time risk predict karta hai!
👉 [View Repository on GitHub](https://github.com/aditaya-raj06/Heart_Attack_Prediction)`;
        }
        return `Aditaya's **Heart Attack Risk Prediction System** is a clinical AI application evaluating cardiac telemetry (cholesterol, resting ECG, blood pressure) with high diagnostic accuracy.
👉 [View Repository on GitHub](https://github.com/aditaya-raj06/Heart_Attack_Prediction)`;
      }

      // Skills
      if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language')) {
        if (inHindi) {
          return `Aditaya ka core technical stack:
• **Languages**: Python, C, Java, JavaScript (ES6+), SQL, HTML5, CSS3.
• **AI & ML**: Scikit-Learn, NumPy, Pandas, Matplotlib, Predictive Analytics.
• **Web & Backend**: Node.js, Express.js, Flask, RESTful APIs.
• **Databases & Cloud**: PostgreSQL, MySQL, MongoDB, SQLite, Supabase, Vercel, Render.`;
        }
        return `Aditaya's core technical stack:
• **Languages**: Python, C, Java, JavaScript (ES6+), SQL, HTML5, CSS3.
• **Machine Learning**: Scikit-Learn, NumPy, Pandas, Matplotlib, Predictive Analytics.
• **Web & Backend**: Node.js, Express.js, Flask, RESTful APIs.
• **Databases & Cloud**: PostgreSQL, MySQL, MongoDB, SQLite, Supabase, Vercel, Render.`;
      }

      // Resume
      if (q.includes('resume') || q.includes('cv') || q.includes('biodata')) {
        if (inHindi) {
          return `Aap Aditaya ka official 1-page PDF resume yahan se download kar sakte hain:
👉 [Download Aditaya's Resume](assets/Aditaya_Raj_Resume.pdf)`;
        }
        return `You can download Aditaya's official 1-page ATS-friendly PDF resume right here:
👉 [Download Aditaya's Resume](assets/Aditaya_Raj_Resume.pdf)`;
      }

      // Contact
      if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach') || q.includes('chat') || q.includes('meeting')) {
        if (inHindi) {
          return `Aap Aditaya se direct connect kar sakte hain:
📅 **15-Min Quick Chat**: Top par **"Book 15-Min Call"** button dabaiye!
📧 **Email**: [adityarajraja01@gmail.com](mailto:adityarajraja01@gmail.com)
💼 **LinkedIn**: [linkedin.com/in/aditayaraj06](https://linkedin.com/in/aditayaraj06)
🐙 **GitHub**: [github.com/aditaya-raj06](https://github.com/aditaya-raj06)`;
        }
        return `You can connect with Aditaya directly through any of the following channels:
📅 **15-Min Quick Chat**: Click the **"Book 15-Min Call"** button in the hero section!
📧 **Email**: [adityarajraja01@gmail.com](mailto:adityarajraja01@gmail.com)
💼 **LinkedIn**: [linkedin.com/in/aditayaraj06](https://linkedin.com/in/aditayaraj06)
🐙 **GitHub**: [github.com/aditaya-raj06](https://github.com/aditaya-raj06)`;
      }

      // Education
      if (q.includes('education') || q.includes('college') || q.includes('study') || q.includes('padhai')) {
        if (inHindi) {
          return `Aditaya currently **B.Tech Computer Science & Engineering (Class of 2028 / CSE'28)** pursue kar rahe hain Bareilly, Uttar Pradesh se.`;
        }
        return `Aditaya is currently pursuing his **Bachelor of Technology (B.Tech) in Computer Science & Engineering (Class of 2028 / CSE'28)** based in Bareilly, Uttar Pradesh, India.`;
      }

      // Default
      if (inHindi) {
        return `Main Aditaya Raj ki AI assistant Geet hoon! Main Hinglish aur English dono me baat kar sakti hoon. Aap mujhse unke **projects**, **skills** (Python, C, Java, ML), **education** (CSE'28), **resume**, ya **contact channels** ke baare me kuch bhi pooch sakte hain.`;
      }
      return `I am Geet, Aditaya Raj's AI voice assistant! I can speak fluently in both English and Hinglish. Feel free to ask me anything about his **projects**, **technical skills**, **education** (CSE'28), **resume**, or **contact options**!`;
    }
  }
})();
