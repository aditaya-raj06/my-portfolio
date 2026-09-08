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
 * Intelligent Rule-based NLP Responder for Geet
 */
function getGeetAnswer(userPrompt) {
  const q = (userPrompt || '').toLowerCase().trim();

  if (q.includes('who are you') || q.includes('naam kya hai') || q.includes('who is geet') || q.includes('tera naam')) {
    return `Namaste! Mera naam **Geet** hai. Main Aditaya Raj ki personal AI assistant hoon. Main aapko Aditaya ke projects, skills, education, experience aur contact details ke bare me sab kuch bata sakti hoon. Aap mujhse unke kisi bhi kaam ke bare me pooch sakte hain!`;
  }

  if (q.includes('who is aditaya') || q.includes('aditaya kaun hai') || q.includes('about') || q.includes('introduce') || q.includes('bio')) {
    return `**Aditaya Raj** ek energetic Full-Stack Developer aur Machine Learning Engineer hain. Wo currently **B.Tech Computer Science & Engineering (Class of 2028 / CSE'28)** pursue kar rahe hain Bareilly, UP se. 
Unka primary focus clinical machine learning systems (jaise cardiovascular risk prediction) aur high-performance scalable web applications build karne me hai. Wo Python, C, Java, aur JavaScript me highly proficient hain!`;
  }

  if (q.includes('project') || q.includes('work') || q.includes('kaam') || q.includes('shipped') || q.includes('portfolio')) {
    return `Aditaya ne kai real-world projects build kiye hain. Inme se 3 flagship projects ye hain:
1. 🫀 **Heart Attack Risk Prediction System**: Clinical ML model jo patient health metrics se cardiovascular risk predict karta hai (Python, Scikit-Learn, Flask, SQLite).
2. 📊 **ML-All**: Open-source machine learning suite jisme regression, classification aur model evaluation pipelines benchmarked hain.
3. ⚡ **Modern Portfolio & Real-Time Sync Engine**: Apple-grade UI backed by Node.js with live GitHub auto-sync webhooks and me (Geet)!

Aap upar "Projects" section me live preview aur GitHub source code bhi dekh sakte hain.`;
  }

  if (q.includes('heart') || q.includes('attack') || q.includes('health') || q.includes('medical')) {
    return `Aditaya ka **Heart Attack Risk Prediction System** ek clinical diagnostic tool hai. Isme patient ke cardiovascular parameters (cholesterol, blood pressure, heart rate, age, etc.) ko Scikit-Learn model me process karke real-time risk assessment provide kiya jata hai. Iska web frontend Flask aur SQLite ke sath bana hai! 
GitHub link: [Heart_Attack_Prediction](https://github.com/aditaya-raj06/Heart_Attack_Prediction)`;
  }

  if (q.includes('skill') || q.includes('tech stack') || q.includes('language') || q.includes('technologies')) {
    return `Aditaya ka technical stack kaafi comprehensive hai:
• **Languages**: Python, C, Java, JavaScript (ES6+), SQL, HTML5, CSS3/SASS.
• **Frameworks & Web**: Node.js, Express.js, Flask, RESTful APIs.
• **Databases & Cloud**: PostgreSQL, MySQL, MongoDB, SQLite, Supabase, Vercel, Render.
• **AI & Data Science**: Scikit-Learn, NumPy, Pandas, Matplotlib, Predictive Analytics.
• **Tools**: Git, GitHub, VS Code, Figma, Canva.`;
  }

  if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('padhai') || q.includes('study')) {
    return `Aditaya **Bachelor of Technology (B.Tech) in Computer Science & Engineering (Class of 2028)** ke scholar hain. Unka academic focus Data Structures & Algorithms, Object-Oriented Programming, aur Database Systems par hai.`;
  }

  if (q.includes('resume') || q.includes('cv') || q.includes('biodata')) {
    return `Aap Aditaya ka official 1-Page ATS-friendly PDF Resume direct download kar sakte hain:
👉 [Download Aditaya's Resume](assets/Aditaya_Raj_Resume.pdf)
Ya fir hero section me **"View / Download CV"** button par click karein!`;
  }

  if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach') || q.includes('phone') || q.includes('social')) {
    return `Aap Aditaya se in channels ke through directly connect kar sakte hain:
📧 **Email**: [adityarajraja01@gmail.com](mailto:adityarajraja01@gmail.com)
🐙 **GitHub**: [github.com/aditaya-raj06](https://github.com/aditaya-raj06)
💼 **LinkedIn**: [linkedin.com/in/aditayaraj06](https://linkedin.com/in/aditayaraj06)
📸 **Instagram**: [instagram.com/aditaya_.raj](https://instagram.com/aditaya_.raj/)
🐦 **Twitter/X**: [x.com/Aditaya0612](https://x.com/Aditaya0612)

Aap page ke neeche contact form bhi fill kar sakte hain, Aditaya ko direct notification mil jayega!`;
  }

  // Default intelligent fallback
  return `Aditaya Raj ke baare me poochne ke liye shukriya! Main unke **projects** (jaise Heart Attack ML Predictor), **skills** (Python, C, Java, Full-Stack), **education** (CSE'28), **resume download**, ya **contact details** ke bare me sab kuch bata sakti hoon. 
Aap kya janna chahte hain?`;
}

/**
 * POST /api/geet - Chat endpoint
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
