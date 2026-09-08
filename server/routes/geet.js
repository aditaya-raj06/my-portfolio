import express from 'express';

const router = express.Router();

/**
 * Knowledge Base Context for Aditaya Raj
 */
const ADITAYA_PROFILE = {
  name: "Aditaya Raj",
  title: "Full-Stack Developer & Machine Learning Engineer",
  education: "Bachelor of Technology (B.Tech) in Computer Science & Engineering (Class of 2028 / CSE'28), Bareilly, UP, India.",
  location: "Bareilly, UP, India",
  email: "adityarajraja01@gmail.com",
  socials: {
    github: "https://github.com/aditaya-raj06",
    linkedin: "https://linkedin.com/in/aditayaraj06",
    instagram: "https://instagram.com/aditaya_.raj/",
    twitter: "https://x.com/Aditaya0612"
  },
  flagshipProjects: [
    {
      title: "Heart Attack Risk Prediction System",
      tech: "Python, Scikit-Learn, Flask, Pandas, NumPy, SQLite",
      description: "Clinical diagnostic machine learning application trained on patient cardiovascular parameters to calculate risk probabilities via an interactive web dashboard.",
      url: "https://github.com/aditaya-raj06/Heart_Attack_Prediction"
    },
    {
      title: "ML-All: Applied Machine Learning Suite",
      tech: "Python, NumPy, Pandas, Scikit-Learn, Matplotlib",
      description: "Curated open-source collection of supervised and unsupervised machine learning algorithms, model evaluation pipelines, and statistical analysis.",
      url: "https://github.com/aditaya-raj06/ML-All"
    },
    {
      title: "Modern Interactive Portfolio & Real-Time Sync Engine",
      tech: "Node.js, Express, JavaScript, HTML5, CSS3, Webhooks",
      description: "High-impact Apple-grade portfolio featuring real-time GitHub auto-sync, developer CLI console, and interactive AI assistant (Geet).",
      url: "https://github.com/aditaya-raj06/my-portfolio"
    }
  ],
  skills: {
    languages: ["Python", "C", "Java", "JavaScript (ES6+)", "SQL", "HTML5", "CSS3 / SASS"],
    backendWeb: ["Node.js", "Express", "Flask", "RESTful APIs", "WebSockets"],
    databasesCloud: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "SQLite", "Vercel", "Render"],
    aiMl: ["Scikit-Learn", "NumPy", "Pandas", "Matplotlib", "Predictive Analytics", "EDA"],
    tools: ["Git", "GitHub (CI/CD, Webhooks)", "VS Code", "Figma", "Canva"]
  },
  resumeUrl: "assets/Aditaya_Raj_Resume.pdf"
};

/**
 * Detect whether query is in Hindi / Hinglish or English
 */
function isHindiOrHinglish(text) {
  if (/[\u0900-\u097F]/.test(text)) return true;
  const hindiKeywords = [
    'kya', 'hai', 'hain', 'kaise', 'kaun', 'koun', 'batao', 'mera', 'meri', 'mere',
    'aap', 'tum', 'namaste', 'shukriya', 'aur', 'kuch', 'bhi', 'kahan', 'kab',
    'kyu', 'kyun', 'nahi', 'haan', 'acha', 'theek', 'padhai', 'college', 'kitna',
    'chahiye', 'karna', 'karta', 'karti', 'hoga', 'hogi', 'kaam', 'baare', 'bataiye'
  ];
  const lower = (text || '').toLowerCase();
  return hindiKeywords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(lower));
}

/**
 * Intelligent Bilingual Rule-based NLP Responder for Geet (Hinglish & English)
 */
function getGeetAnswer(userPrompt) {
  const q = (userPrompt || '').toLowerCase().trim();
  const inHindi = isHindiOrHinglish(userPrompt);

  // Identity / Intro
  if (q.includes('who are you') || q.includes('naam kya hai') || q.includes('who is geet') || q.includes('tera naam') || q.includes('aap kaun ho')) {
    if (inHindi) {
      return `Namaste! Mera naam **Geet** hai. Main Aditaya Raj ki AI voice assistant hoon. Main aapke sath **Hinglish** aur **English** dono me baat kar sakti hoon! Aap Aditaya ke projects, skills, background aur contact ke bare me kuch bhi pooch sakte hain.`;
    }
    return `Hello! My name is **Geet**, Aditaya Raj's AI voice assistant. I can converse fluently in both **English** and **Hinglish**. Feel free to ask me anything about Aditaya's projects, technical skills, background, or hiring details!`;
  }

  // About Aditaya
  if (q.includes('who is aditaya') || q.includes('aditaya kaun hai') || q.includes('about aditaya') || q.includes('bio') || q.includes('introduce')) {
    if (inHindi) {
      return `**Aditaya Raj** ek dedicated Software Engineer aur Machine Learning developer hain, jo currently **B.Tech Computer Science & Engineering (Class of 2028 / CSE'28)** pursue kar rahe hain Bareilly, UP se. 
Unka primary focus clinical machine learning systems (jaise Heart Attack risk prediction) aur high-performance web applications build karne me hai. Wo Python, C, Java, aur modern JavaScript me expert hain!`;
    }
    return `**Aditaya Raj** is a passionate Full-Stack Software Developer & Applied Machine Learning Engineer pursuing his **B.Tech in Computer Science & Engineering (Class of 2028 / CSE'28)** from Bareilly, UP, India.
He specializes in clinical AI systems—notably his Heart Attack Risk Prediction platform—as well as robust, high-performance web backends using Python, JavaScript, Java, and C.`;
  }

  // Projects
  if (q.includes('project') || q.includes('work') || q.includes('kaam') || q.includes('portfolio') || q.includes('code') || q.includes('repo')) {
    if (inHindi) {
      return `Aditaya ke top flagship projects:
1. 🫀 **Heart Attack Risk Prediction System**: Clinical ML model jo patient metrics se cardiovascular risk evaluate karta hai (Python, Scikit-Learn, Flask, SQLite).
2. 📊 **ML-All**: Open-source machine learning algorithm suite jisme regression, classification aur evaluation models benchmarked hain.
3. ⚡ **Dynamic Portfolio & Live Sync Engine**: Ye portfolio website jisme live GitHub webhooks aur mera voice system integrated hai!`;
    }
    return `Here are Aditaya's flagship software & AI projects:
1. 🫀 **Heart Attack Risk Prediction System**: A clinical predictive ML platform estimating cardiovascular risk probabilities from patient telemetry (Python, Scikit-Learn, Flask, SQLite).
2. 📊 **ML-All**: An open-source machine learning algorithm repository implementing regression, classification, and statistical benchmarking.
3. ⚡ **Dynamic Portfolio & Real-Time Sync Engine**: Full-stack application backed by Node.js, live GitHub webhooks, and me (Geet)!`;
  }

  // Heart Attack Project
  if (q.includes('heart') || q.includes('attack') || q.includes('health') || q.includes('medical') || q.includes('cardio')) {
    if (inHindi) {
      return `Aditaya ka **Heart Attack Risk Prediction System** ek clinical ML model hai jo patient ke cholesterol, blood pressure, heart rate jaise parameters analyze karke risk assess karta hai with 87%+ accuracy!
👉 [View on GitHub](https://github.com/aditaya-raj06/Heart_Attack_Prediction)`;
    }
    return `Aditaya's **Heart Attack Risk Prediction System** is a clinical AI application evaluating patient cardiac metrics (blood pressure, cholesterol, resting ECG) with high diagnostic accuracy.
👉 [View Repository on GitHub](https://github.com/aditaya-raj06/Heart_Attack_Prediction)`;
  }

  // Skills
  if (q.includes('skill') || q.includes('tech stack') || q.includes('language') || q.includes('technologies')) {
    if (inHindi) {
      return `Aditaya ka technical stack:
• **Languages**: Python, C, Java, JavaScript (ES6+), SQL, HTML5, CSS3.
• **Web & Backend**: Node.js, Express.js, Flask, RESTful APIs.
• **AI & ML**: Scikit-Learn, NumPy, Pandas, Matplotlib, Predictive Analytics.
• **Databases & Cloud**: PostgreSQL, MySQL, MongoDB, SQLite, Supabase, Vercel, Render.`;
    }
    return `Aditaya's core technical stack includes:
• **Languages**: Python, C, Java, JavaScript (ES6+), SQL, HTML5, CSS3.
• **Backend & Web**: Node.js, Express.js, Flask, RESTful APIs.
• **Machine Learning**: Scikit-Learn, NumPy, Pandas, Matplotlib, Predictive Modeling.
• **Databases & Cloud**: PostgreSQL, MySQL, MongoDB, SQLite, Supabase, Vercel, Render.`;
  }

  // AI Tools
  if (q.includes('ai tool') || q.includes('tools') || q.includes('claude') || q.includes('chatgpt') || q.includes('gemini') || q.includes('copilot') || q.includes('cursor')) {
    if (inHindi) {
      return `Aditaya apne engineering workflow me ye top AI tools leverage karte hain:
• 🧠 **Claude (Anthropic)**: System architecture & algorithmic problem solving ke liye.
• ⚡ **ChatGPT (OpenAI)**: Logic exploration aur rapid prototyping ke liye.
• 🌐 **Google Gemini**: Multimodal codebase automation ke liye.
• 🫀 **Scikit-Learn**: Clinical predictive ML (Heart Attack risk modeling).
• 🎙️ **Web Speech AI**: Real-time voice engine jo mujhe (Geet) power karta hai!
• 💻 **GitHub Copilot & Cursor AI**: Pair-programming aur developer speedup ke liye.`;
    }
    return `Aditaya leverages these modern AI tools daily:
• 🧠 **Claude (Anthropic)**: Full-stack system architecture & deep algorithm design.
• ⚡ **ChatGPT (OpenAI)**: Logic exploration, prompt engineering & API design.
• 🌐 **Google Gemini**: Multimodal codebase automation & contextual analysis.
• 🫀 **Scikit-Learn**: Clinical predictive ML for cardiovascular risk prediction.
• 🎙️ **Web Speech AI**: Production voice engine powering me (Geet)!
• 💻 **GitHub Copilot & Cursor AI**: High-velocity pair programming & navigation.`;
  }

  // Resume / CV
  if (q.includes('resume') || q.includes('cv') || q.includes('biodata')) {
    if (inHindi) {
      return `Aap Aditaya ka official 1-page PDF resume direct yahan se download kar sakte hain:
👉 [Download Aditaya's Resume](assets/Aditaya_Raj_Resume.pdf)
Ya hero section me "View / Download CV" button dabayein!`;
    }
    return `You can download Aditaya's official 1-page ATS-friendly PDF resume right here:
👉 [Download Aditaya's Resume](assets/Aditaya_Raj_Resume.pdf)
Or click the "View / Download CV" button in the hero section above!`;
  }

  // Contact / Hire / Meet
  if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach') || q.includes('meeting') || q.includes('chat')) {
    if (inHindi) {
      return `Aap Aditaya se direct connect kar sakte hain:
📅 **15-Min Quick Call**: Top par **"Book 15-Min Call"** button dabaiye!
📧 **Email**: [adityarajraja01@gmail.com](mailto:adityarajraja01@gmail.com)
💼 **LinkedIn**: [linkedin.com/in/aditayaraj06](https://linkedin.com/in/aditayaraj06)
🐙 **GitHub**: [github.com/aditaya-raj06](https://github.com/aditaya-raj06)`;
    }
    return `You can get in touch with Aditaya through any of the following channels:
📅 **15-Min Quick Catchup**: Click the **"Book 15-Min Call"** button in the hero section!
📧 **Email**: [adityarajraja01@gmail.com](mailto:adityarajraja01@gmail.com)
💼 **LinkedIn**: [linkedin.com/in/aditayaraj06](https://linkedin.com/in/aditayaraj06)
🐙 **GitHub**: [github.com/aditaya-raj06](https://github.com/aditaya-raj06)`;
  }

  // Wake Word standalone greeting ("Hey Geet", "Suno Geet", "Geet")
  if (/^(hey|suno|hello|ok)?\s*(geet|geeta|gita|git)[!?,.\s]*$/i.test(q)) {
    if (inHindi) {
      return `Haanji Aditaya, boliye? Main aapke portfolio, projects, skills aur education ke baare me batane ke liye taiyaar hoon!`;
    }
    return `Yes! I am listening. How can I assist you with exploring Aditaya's portfolio, projects, or background?`;
  }

  // Education
  if (q.includes('education') || q.includes('college') || q.includes('school') || q.includes('degree') || q.includes('padhai') || q.includes('study') || q.includes('12th') || q.includes('10th') || q.includes('invertis')) {
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

  // Out-of-Domain Guardrail (Non-portfolio questions)
  const isOutOfDomain = 
    q.includes('weather') || q.includes('mausam') || q.includes('temperature') ||
    q.includes('prime minister') || q.includes('president') || q.includes('capital of') ||
    q.includes('cricket') || q.includes('football') || q.includes('movie') || q.includes('film') ||
    q.includes('song') || q.includes('gana') || q.includes('joke') || q.includes('chutkula') ||
    q.includes('recipe') || q.includes('khana') || q.includes('solve this') || q.includes('calculate');

  if (isOutOfDomain) {
    if (inHindi) {
      return `Main sirf **Aditaya Raj** ke portfolio, unke projects, skills, education (Invertis University) aur contact details ke liye train ki gayi hoon. Aap mujhse Aditaya ke baare me kuch bhi poochh sakte hain!`;
    }
    return `I am trained exclusively as **Aditaya Raj's portfolio assistant**. I can only answer questions related to his software projects, technical skills, education at Invertis University, and hiring details. Please feel free to ask me anything about Aditaya!`;
  }

  // Default fallback
  if (inHindi) {
    return `Main Aditaya Raj ki AI assistant Geet hoon! Main sirf unke **projects**, **skills** (Python, C, Java, ML), **education** (Invertis University, CSE'28), **resume**, ya **contact channels** ke baare me guide karne ke liye train hoon. Aap mujhse Aditaya ke baare me kya janna chahte hain?`;
  }
  return `I am Geet, Aditaya Raj's AI voice assistant! I am trained exclusively for his portfolio to answer questions about his **projects**, **technical skills**, **education** at Invertis University, and **resume**. How can I help you learn about Aditaya?`;
}

/**
 * POST /api/geet - Bilingual Chat endpoint
 */
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'A valid message string is required.'
    });
  }

  try {
    const reply = getGeetAnswer(message);
    res.json({
      success: true,
      sender: 'Geet',
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Geet could not process your message.',
      message: err.message
    });
  }
});

export default router;
