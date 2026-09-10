/**
 * ==============================================================================
 * GEET - SIRI / ALEXA-STYLE TALKING AI ASSISTANT FOR ADITAYA RAJ
 * Hands-free Wake-Word Detection ("Hey Geet" / "Suno Geet" / "Geet")
 * Voice Action Execution & Strict Portfolio Guardrails
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
    const statusBadge = document.getElementById('geet-trigger-status');
    const listeningIndicator = document.getElementById('geet-listening-indicator');

    if (!triggerBtn || !chatModal) return;

    let isAudioMuted = localStorage.getItem('geet_audio_muted') === 'true';
    let isListening = false;
    let recognition = null;
    let wakeWordActive = true;
    let audioCtx = null;

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

    // Gentle Siri-style audio chime
    function playSiriChime(type = 'wake') {
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'wake') {
          // Double pleasant tone (like Siri / Alexa wake chime)
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.12); // A5
          gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.3);
        }
      } catch (e) {
        // Silent fallback if audio context restricted
      }
    }

    // Toggle Modal Window
    triggerBtn.addEventListener('click', () => {
      openChat();
      // On direct click, trigger voice listening if supported
      startVoiceRecognition();
    });

    closeBtn?.addEventListener('click', () => {
      closeChat();
    });

    function openChat() {
      chatModal.classList.add('active');
      chatInput?.focus();
      scrollChatToBottom();
    }

    function closeChat() {
      chatModal.classList.remove('active');
      stopAllSpeech();
      stopVoiceRecognition();
    }

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
    // VOICE MODE: TALKING ASSISTANT & WAKE WORD ENGINE
    // =========================================================================
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English / Hinglish

      recognition.onstart = () => {
        isListening = true;
        micBtn?.classList.add('listening');
        triggerBtn.classList.add('listening');
        if (statusBadge) statusBadge.textContent = 'Listening...';
        if (listeningIndicator) listeningIndicator.textContent = 'Listening... Say "Hey Geet" or speak command';
        if (chatInput) chatInput.placeholder = 'Listening... (e.g. "Projects dikhao", "Hey Geet")';
      };

      recognition.onresult = (event) => {
        const lastIdx = event.results.length - 1;
        const transcript = event.results[lastIdx][0].transcript.trim();
        console.log('[Geet Voice]', transcript);

        handleVoiceInput(transcript);
      };

      recognition.onerror = (err) => {
        console.warn('[Geet Voice Error]', err.error);
        if (err.error === 'not-allowed') {
          wakeWordActive = false;
          stopVoiceRecognition();
        }
      };

      recognition.onend = () => {
        isListening = false;
        micBtn?.classList.remove('listening');
        triggerBtn.classList.remove('listening');
        if (statusBadge) statusBadge.textContent = 'Talking AI';
        if (listeningIndicator) listeningIndicator.textContent = 'Say "Hey Geet" or "Suno Geet" • Online';
        if (chatInput) chatInput.placeholder = 'Ask Geet in English or Hinglish...';

        // Auto-restart if wake-word mode is active and modal is open or active
        if (wakeWordActive && chatModal.classList.contains('active')) {
          try {
            recognition.start();
          } catch (e) {}
        }
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
        startVoiceRecognition();
      }
    });

    function startVoiceRecognition() {
      if (!recognition || isListening) return;
      stopAllSpeech();
      try {
        recognition.start();
      } catch (err) {
        // already started
      }
    }

    function stopVoiceRecognition() {
      isListening = false;
      micBtn?.classList.remove('listening');
      triggerBtn.classList.remove('listening');
      try {
        recognition?.stop();
      } catch (e) {}
    }

    // =========================================================================
    // VOICE INPUT PROCESSOR: WAKE-WORD & IN-PORTFOLIO ACTIONS
    // =========================================================================
    function handleVoiceInput(transcript) {
      if (!transcript) return;
      const lower = transcript.toLowerCase();

      // Wake Word Pattern: "Hey Geet", "Suno Geet", "Geet", "Hello Geet", "Ok Geet"
      const wakeWordRegex = /^(hey|suno|hello|ok|are)?\s*(geet|geeta|gita|git)\b/i;
      const isWakeWord = wakeWordRegex.test(lower);

      // Strip wake word to extract command
      let command = lower.replace(wakeWordRegex, '').trim();

      // If just the wake word was spoken (e.g. "Hey Geet", "Suno Geet", "Geet")
      if (isWakeWord && (!command || command.length < 2)) {
        openChat();
        playSiriChime('wake');
        const greeting = isHindiOrHinglish(lower)
          ? `Haanji Aditaya, boliye? Main aapke portfolio me kya dikhaon?`
          : `Yes, I am listening! What would you like to explore in Aditaya's portfolio?`;
        appendMessage('user', transcript);
        appendMessage('geet', greeting);
        speakText(greeting);
        return;
      }

      // If command was accompanied by wake word or direct speech, open chat and process
      openChat();
      if (isWakeWord) {
        playSiriChime('wake');
      }

      const rawInput = command || transcript;
      sendMessage(rawInput);
    }

    // =========================================================================
    // IN-PORTFOLIO VOICE ACTIONS (Siri/Alexa-like Control)
    // =========================================================================
    function executePortfolioAction(q) {
      // 1. Projects Navigation
      if (q.includes('project') || q.includes('kaam') || q.includes('work')) {
        if (q.includes('ml') || q.includes('ai') || q.includes('machine learning')) {
          const mlBtn = document.querySelector('.filter-btn[data-category="ai-ml"]');
          mlBtn?.click();
        } else if (q.includes('all') || q.includes('saara')) {
          const allBtn = document.querySelector('.filter-btn[data-category="all"]');
          allBtn?.click();
        }
        const sec = document.getElementById('projects');
        sec?.scrollIntoView({ behavior: 'smooth' });
        return true;
      }

      // 2. Technical Skills Navigation
      if (q.includes('skill') || q.includes('stack') || q.includes('technolog')) {
        const sec = document.getElementById('skills');
        sec?.scrollIntoView({ behavior: 'smooth' });
        return true;
      }

      // 3. Education / Invertis University Navigation
      if (q.includes('education') || q.includes('college') || q.includes('school') || q.includes('invertis') || q.includes('padhai')) {
        const sec = document.getElementById('experience');
        sec?.scrollIntoView({ behavior: 'smooth' });
        return true;
      }

      // 4. Resume / CV Action
      if (q.includes('open resume') || q.includes('resume open') || q.includes('download cv') || q.includes('resume download') || q.includes('view resume')) {
        window.open('resume.html', '_blank');
        return true;
      }

      // 5. Booking / Call Action
      if (q.includes('book call') || q.includes('schedule') || q.includes('call book') || q.includes('meeting') || q.includes('15-min')) {
        const bookingBackdrop = document.getElementById('booking-modal-backdrop');
        if (bookingBackdrop) {
          bookingBackdrop.classList.add('active');
        } else {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }
        return true;
      }

      // 6. Contact Section Navigation
      if (q.includes('contact') || q.includes('reach') || q.includes('email') || q.includes('message')) {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        return true;
      }

      // 7. Developer Terminal
      if (q.includes('terminal') || q.includes('console') || q.includes('cli')) {
        const sec = document.getElementById('terminal');
        sec?.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('terminal-cli-input')?.focus();
        return true;
      }

      // 8. Dark / Light Mode Toggle
      if (q.includes('dark mode') || q.includes('light mode') || q.includes('theme')) {
        const toggleBtn = document.getElementById('theme-toggle-btn');
        toggleBtn?.click();
        return true;
      }

      // 9. Portfolio Guide / Highlights
      if (q.includes('tour') || q.includes('guide') || q.includes('audio tour') || q.includes('highlights')) {
        speakResponse("Main Aditaya Raj ke portfolio ki digital assistant hoon. Aap mujhse unke flagship machine learning projects, core skills, Invertis University B.Tech education ya contact details ke baare me poochh sakte hain!", 'hi-IN');
        return true;
      }

      return false;
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
        return isIndian && (n.includes('female') || (!n.includes('male') && !n.includes('rishi') && !n.includes('aman')));
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
        .replace(/👉|✨|🚀|💻|📄|📬|📧|💼|🐙|📸|🫀|📊|⚡|•|🎓|🏫|🎒|📅/g, '')
        .replace(/\n+/g, '. ')
        .trim();

      if (!clean) return;

      const utterance = new SpeechSynthesisUtterance(clean);
      const femaleVoice = getIndianFemaleVoice();

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      if (isHindiOrHinglish(clean)) {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }

      utterance.pitch = 1.08; // Natural, friendly Indian female cadence
      utterance.rate = 1.0;   // Conversational speed

      utterance.onstart = () => {};
      utterance.onend = () => {};
      utterance.onerror = () => {};

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
        'unka', 'unke', 'unki', 'bata', 'dikhao', 'kholo', 'karo'
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

      // Execute in-portfolio visual actions if matching
      executePortfolioAction(userText.toLowerCase());

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

        // Attempt 2: Local bilingual NLP fallback
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
     * With Strict Portfolio Boundary Guardrails & Invertis University Updates
     */
    function clientSideGeetAnswer(prompt) {
      const q = prompt.toLowerCase().trim();
      const inHindi = isHindiOrHinglish(prompt);

      // 1. Wake-word greeting
      if (/^(hey|suno|hello|ok)?\s*(geet|geeta|gita|git)[!?,.\s]*$/i.test(q)) {
        if (inHindi) {
          return `Haanji Aditaya, boliye? Main aapke portfolio, projects, skills aur education ke baare me batane ke liye taiyaar hoon!`;
        }
        return `Yes! I am listening. How can I assist you with exploring Aditaya's portfolio, projects, or background?`;
      }

      // 2. Identity
      if (q.includes('who are you') || q.includes('naam') || q.includes('who is geet') || q.includes('koun') || q.includes('intro')) {
        if (inHindi) {
          return `Namaste! Mera naam **Geet** hai. Main Aditaya Raj ki Siri-style AI voice assistant hoon. Main sirf Aditaya ke portfolio, projects, skills, education aur contact details ke liye trained hoon. Aap mujhse Aditaya ke bare me kuch bhi pooch sakte hain!`;
        }
        return `Hello! My name is **Geet**, Aditaya Raj's Siri-style AI voice assistant. I am trained exclusively for his portfolio to guide you through his projects, skills, education, and achievements. Feel free to ask me anything about Aditaya!`;
      }

      // 3. About Aditaya
      if (q.includes('who is aditaya') || q.includes('aditaya kaun hai') || q.includes('about aditaya') || q.includes('bio')) {
        if (inHindi) {
          return `**Aditaya Raj** ek Software Engineer aur Machine Learning developer hain, jo currently **B.Tech Computer Science & Engineering (Class of 2028 / CSE'28)** pursue kar rahe hain **Invertis University, Bareilly** se. Unka core focus clinical machine learning systems aur scalable full-stack web applications me hai!`;
        }
        return `**Aditaya Raj** is a Full-Stack Software Developer & Machine Learning Engineer pursuing his **B.Tech in Computer Science & Engineering (Class of 2028 / CSE'28)** at **Invertis University, Bareilly**, India. He specializes in clinical AI diagnostic models and modern web applications!`;
      }

      // 4. Projects
      if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('code') || q.includes('repo') || q.includes('kaam')) {
        if (inHindi) {
          return `Aditaya ke top flagship projects:
1. 🫀 **Heart Attack Risk Prediction System**: Clinical ML platform jo patient telemetry se cardiovascular risk evaluate karta hai (Python, Scikit-Learn, Flask).
2. 📊 **ML-All**: Open-source machine learning algorithms library.
3. ⚡ **Dynamic Portfolio & Live Sync**: Full-stack web application with authentic GitHub sync aur talking voice assistant (Geet)!`;
        }
        return `Here are Aditaya's flagship projects:
1. 🫀 **Heart Attack Risk Prediction System**: Clinical predictive ML platform estimating cardiovascular risk from patient telemetry (Python, Scikit-Learn, Flask).
2. 📊 **ML-All**: Open-source machine learning algorithm suite implementing regression, classification, and model evaluation.
3. ⚡ **Dynamic Portfolio & Live Sync**: Full-stack application backed by authentic GitHub activity and Siri-style talking voice AI (me)!`;
      }

      // 5. Heart Attack Project
      if (q.includes('heart') || q.includes('attack') || q.includes('health') || q.includes('medical') || q.includes('cardio')) {
        if (inHindi) {
          return `Aditaya ka **Heart Attack Risk Prediction System** cardiovascular parameters (cholesterol, blood pressure, resting ECG) ko evaluate karke clinical risk predict karta hai!
👉 [View Repository on GitHub](https://github.com/aditaya-raj06/Heart_Attack_Prediction)`;
        }
        return `Aditaya's **Heart Attack Risk Prediction System** is a clinical machine learning application evaluating patient cardiac telemetry with high diagnostic accuracy.
👉 [View Repository on GitHub](https://github.com/aditaya-raj06/Heart_Attack_Prediction)`;
      }

      // 6. Skills
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

      // 6.1 AI Tools
      if (q.includes('ai tool') || q.includes('tools') || q.includes('claude') || q.includes('chatgpt') || q.includes('gemini') || q.includes('copilot') || q.includes('cursor')) {
        if (inHindi) {
          return `Aditaya apne engineering workflow me ye top AI tools use karte hain:
• 🧠 **Claude (Anthropic)**: Architecture design aur complex problem solving ke liye.
• ⚡ **ChatGPT (OpenAI)**: Logic structuring aur rapid prototyping ke liye.
• 🌐 **Google Gemini**: Multimodal codebase automation ke liye.
• 🫀 **Scikit-Learn**: Clinical predictive ML (Heart Attack risk modeling).
• 🎙️ **Web Speech AI**: Real-time voice engine jo mujhe (Geet) power karta hai!
• 💻 **GitHub Copilot & Cursor AI**: Pair-programming aur developer speed ke liye.`;
        }
        return `Aditaya leverages these core AI tools daily:
• 🧠 **Claude (Anthropic)**: Full-stack system architecture & deep algorithm design.
• ⚡ **ChatGPT (OpenAI)**: Logic exploration, prompt engineering & API design.
• 🌐 **Google Gemini**: Multimodal codebase automation & contextual analysis.
• 🫀 **Scikit-Learn**: Clinical predictive ML for heart risk prediction.
• 🎙️ **Web Speech AI**: Production voice engine powering me (Geet)!
• 💻 **GitHub Copilot & Cursor AI**: High-velocity pair programming & navigation.`;
      }

      // 7. Resume
      if (q.includes('resume') || q.includes('cv') || q.includes('biodata')) {
        if (inHindi) {
          return `Aap Aditaya ka official 1-page ATS-compliant PDF resume yahan se download kar sakte hain:
👉 [Download Aditaya's Resume](assets/Aditaya_Raj_Resume.pdf)
Ya hero section me "View / Download CV" par click karein!`;
        }
        return `You can download Aditaya's official 1-page ATS-compliant PDF resume right here:
👉 [Download Aditaya's Resume](assets/Aditaya_Raj_Resume.pdf)
Or click the "View / Download CV" button in the hero section!`;
      }

      // 8. Contact / Hire / Meet
      if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach') || q.includes('chat') || q.includes('meeting')) {
        if (inHindi) {
          return `Aap Aditaya se direct connect kar sakte hain:
📅 **15-Min Quick Chat**: Hero section me **"Book 15-Min Call"** button dabaiye!
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

      // 9. Education (Invertis University + R.D.S College + K.C.M.F School)
      if (q.includes('education') || q.includes('college') || q.includes('school') || q.includes('study') || q.includes('padhai') || q.includes('12th') || q.includes('10th') || q.includes('invertis')) {
        if (inHindi) {
          return `Aditaya ka complete educational background:
1. 🎓 **B.Tech in Computer Science & Engineering** (2024 — 2028, CSE'28) — **Invertis University, Bareilly**, Uttar Pradesh.
2. 🏫 **Senior Secondary (Class XII)**: BSEB (2022 — 2024) — **R.D.S College**.
3. 🎒 **Secondary (Class X)**: CBSE (2021 — 2022) — **K.C.M.F School**.`;
        }
        return `Aditaya's academic and educational background:
1. 🎓 **B.Tech in Computer Science & Engineering** (2024 — 2028, Class of 2028) at **Invertis University, Bareilly**, Uttar Pradesh, India.
2. 🏫 **Senior Secondary (Class XII)**: BSEB (2022 — 2024) from **R.D.S College**.
3. 🎒 **Secondary (Class X)**: CBSE (2021 — 2022) from **K.C.M.F School**.`;
      }

      // 10. STRICT PORTFOLIO GUARDRAIL (Out-of-domain rejection)
      const isOutOfDomain = 
        q.includes('weather') || q.includes('mausam') || q.includes('temperature') ||
        q.includes('prime minister') || q.includes('president') || q.includes('capital of') ||
        q.includes('cricket') || q.includes('football') || q.includes('movie') || q.includes('film') ||
        q.includes('song') || q.includes('gana') || q.includes('joke') || q.includes('chutkula') ||
        q.includes('recipe') || q.includes('khana') || q.includes('solve this') || q.includes('calculate') ||
        q.includes('bata sakti ho kya duniya') || q.includes('who is the king') || q.includes('politics');

      if (isOutOfDomain) {
        if (inHindi) {
          return `Main sirf **Aditaya Raj** ke portfolio, unke projects, skills, education (Invertis University) aur contact details ke liye train ki gayi hoon. Main portfolio ke bahar ke sawaalon ka jawab nahi de sakti. Aap mujhse Aditaya ke baare me kuch bhi poochh sakte hain!`;
        }
        return `I am trained exclusively as **Aditaya Raj's portfolio assistant**. I can only assist with questions regarding his projects, technical skills, education at Invertis University, and hiring details. Please feel free to ask me anything about Aditaya!`;
      }

      // Default fallback
      if (inHindi) {
        return `Main Aditaya Raj ki AI voice assistant Geet hoon! Main sirf unke **projects**, **skills** (Python, C, Java, ML), **education** (Invertis University, CSE'28), **resume**, ya **contact channels** ke baare me guide karne ke liye train hoon. Aap mujhse Aditaya ke baare me kya janna chahte hain?`;
      }
      return `I am Geet, Aditaya Raj's AI voice assistant! I am trained exclusively for his portfolio to answer questions about his **projects**, **technical skills**, **education** at Invertis University, and **resume**. How can I help you explore Aditaya's portfolio?`;
    }
  }
})();
