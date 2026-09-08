/**
 * ==============================================================================
 * PORTFOLIO DATA CONFIGURATION
 * ==============================================================================
 * 🌟 Note for User:
 * Aapko HTML ya CSS files edit karne ki zaroorat nahi hai.
 * Aap apna saara data (Bio, Projects, Skills, Timeline, Social Links) 
 * sirf is file me update kar sakte hain!
 * ==============================================================================
 */

const portfolioData = {
  // --------------------------------------------------------------------------
  // 1. Personal & Profile Information
  // --------------------------------------------------------------------------
  personal: {
    name: "Aditaya Raj",
    monogram: "AR",
    title: "Full-Stack Developer & AI/ML Engineer | CSE'28",
    availability: "Open for Innovative Projects & Collaborations",
    isAvailable: true,
    location: "Bareilly, UP, India",
    timezone: "Asia/Kolkata (IST)",
    email: "adityarajraja01@gmail.com",
    resumeUrl: "assets/Aditaya_Raj_Resume.pdf",
    tagline: "Computer Science & Engineering scholar (CSE'28) architecting responsive full-stack web applications, clinical machine learning models, and high-performance data systems.",
    bio: [
      "I am a Computer Science & Engineering undergrad (CSE'28) building at the intersection of full-stack web engineering, algorithms, and applied machine learning.",
      "Proficient in Python, C, Java, and modern JavaScript, with hands-on experience developing clinical ML diagnostic platforms (like cardiovascular risk prediction), responsive frontend experiences, and cloud databases with MongoDB, PostgreSQL, and Supabase.",
      "Firm believer in practical engineering — I learn and grow best by architecting and shipping real-world software."
    ],
  },

  // --------------------------------------------------------------------------
  // 2. Dynamic Typing Roles in Hero Header
  // --------------------------------------------------------------------------
  typingRoles: [
    "Full-Stack Web Developer",
    "Machine Learning & AI Enthusiast",
    "CSE Scholar (Batch of 2028)",
    "Creative Problem Solver & Builder"
  ],

  // --------------------------------------------------------------------------
  // 3. High-Impact Highlights / Metrics (Bento Grid)
  // --------------------------------------------------------------------------
  metrics: [
    { number: "4+", label: "Public Repositories & Tools" },
    { number: "90%+", label: "ML Model Prediction Accuracy" },
    { number: "10+", label: "Technologies & Frameworks" },
    { number: "100%", label: "Hands-on Project Delivery" }
  ],

  // --------------------------------------------------------------------------
  // 4. Featured Projects (Case-Study & Metric Driven)
  // --------------------------------------------------------------------------
  projects: [
    {
      id: "heart-attack-prediction",
      title: "Heart Attack Risk Prediction System",
      category: "ai-ml",
      categoryLabel: "Clinical ML & Healthcare",
      description: "Diagnostic machine learning application trained on patient cardiovascular parameters to deliver instant risk assessment and health analytics.",
      impact: "🫀 Trained with clinical datasets & real-time predictive diagnostic web dashboard",
      technologies: ["Python", "Scikit-Learn", "Flask", "Pandas", "NumPy", "SQLite"],
      githubUrl: "https://github.com/aditaya-raj06/Heart_Attack_Prediction",
      liveUrl: "https://github.com/aditaya-raj06/Heart_Attack_Prediction",
      image: "assets/images/project-ai.svg"
    },
    {
      id: "ml-all-suite",
      title: "ML-All: Applied Machine Learning Hub",
      category: "ai-ml",
      categoryLabel: "Data Science & AI",
      description: "Curated suite of supervised and unsupervised machine learning algorithms, model evaluation pipelines, data preprocessing, and statistical visualizations.",
      impact: "📊 Modular implementations of regression, classification & evaluation pipelines",
      technologies: ["Python", "NumPy", "Pandas", "Scikit-Learn", "Matplotlib"],
      githubUrl: "https://github.com/aditaya-raj06/ML-All",
      liveUrl: "https://github.com/aditaya-raj06/ML-All",
      image: "assets/images/project-search.svg"
    },
    {
      id: "interactive-portfolio",
      title: "Modern Interactive Portfolio & CLI",
      category: "fullstack",
      categoryLabel: "Full Stack & Web",
      description: "High-impact developer portfolio featuring dynamic typing, real-time IST clock, custom developer CLI terminal, and 1-click clipboard integration.",
      impact: "⚡ Ultra-fast 60fps animations, zero dependencies & 100/100 Lighthouse score",
      technologies: ["JavaScript (ES6)", "CSS3", "HTML5", "GitHub Pages", "Vercel"],
      githubUrl: "https://github.com/aditaya-raj06/my-portfolio",
      liveUrl: "https://aditaya-raj06.github.io/my-portfolio/",
      image: "assets/images/project-commerce.svg"
    },
    {
      id: "cloud-web-systems",
      title: "Cloud & Database Connected Architectures",
      category: "cloud-systems",
      categoryLabel: "Cloud & Databases",
      description: "Full-stack cloud-native applications and micro-tools backed by scalable databases like Supabase, PostgreSQL, and MongoDB with modern UI workflows.",
      impact: "🛡️ Automated schema migrations, relational integrity & modern API integrations",
      technologies: ["JavaScript", "PostgreSQL", "Supabase", "MongoDB", "Render"],
      githubUrl: "https://github.com/aditaya-raj06",
      liveUrl: "https://github.com/aditaya-raj06",
      image: "assets/images/project-cloud.svg"
    }
  ],

  // --------------------------------------------------------------------------
  // 5. Skills & Core Competencies
  // --------------------------------------------------------------------------
  skills: [
    {
      category: "Programming Languages",
      icon: "code",
      items: [
        { name: "Python", level: "Advanced", percentage: 92 },
        { name: "C Language", level: "Proficient", percentage: 88 },
        { name: "Java", level: "Intermediate", percentage: 80 },
        { name: "JavaScript (ES6+)", level: "Advanced", percentage: 86 }
      ]
    },
    {
      category: "Web & UI Engineering",
      icon: "layout",
      items: [
        { name: "HTML5 / Semantic Web", level: "Expert", percentage: 95 },
        { name: "CSS3 / SASS / Responsive UI", level: "Advanced", percentage: 92 },
        { name: "DOM Manipulation & Web APIs", level: "Advanced", percentage: 88 },
        { name: "Figma & UI Design", level: "Proficient", percentage: 82 }
      ]
    },
    {
      category: "Databases, Cloud & Tools",
      icon: "server",
      items: [
        { name: "PostgreSQL & MySQL", level: "Advanced", percentage: 85 },
        { name: "MongoDB & Supabase", level: "Advanced", percentage: 86 },
        { name: "Git & GitHub Version Control", level: "Advanced", percentage: 90 },
        { name: "Vercel & Render Deployment", level: "Advanced", percentage: 88 }
      ]
    },
    {
      category: "Machine Learning & Data Science",
      icon: "cpu",
      items: [
        { name: "NumPy & Pandas", level: "Advanced", percentage: 90 },
        { name: "Scikit-Learn & Predictive Modeling", level: "Advanced", percentage: 88 },
        { name: "Data Preprocessing & EDA", level: "Advanced", percentage: 85 },
        { name: "AI Integration & Workflows", level: "Proficient", percentage: 82 }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 6. Experience & Education Milestones
  // --------------------------------------------------------------------------
  experience: [
    {
      role: "B.Tech in Computer Science & Engineering",
      company: "CSE Undergraduate Scholar (Class of 2028)",
      period: "2024 — 2028",
      location: "Bareilly, UP, India",
      bullets: [
        "Studying Core Computer Science fundamentals: Data Structures & Algorithms, Object-Oriented Programming, and Database Management Systems.",
        "Developing real-world applied Machine Learning models including clinical healthcare risk prediction platforms.",
        "Actively collaborating on open-source repositories and participating in technical developer communities."
      ]
    },
    {
      role: "Senior Secondary (Class XII)",
      company: "R.D.S College | BSEB",
      period: "2022 — 2024",
      location: "Bihar, India",
      bullets: [
        "Completed Senior Secondary education under Bihar School Examination Board (BSEB) with strong focus on Science & Mathematics.",
        "Built core analytical problem solving, logical reasoning, and pre-engineering fundamentals."
      ]
    },
    {
      role: "Secondary (Class X)",
      company: "K.C.M.F School | CBSE",
      period: "2021 — 2022",
      location: "India",
      bullets: [
        "Completed Secondary School Examination under Central Board of Secondary Education (CBSE).",
        "Recognized for strong academic performance in science, mathematics, and computer foundations."
      ]
    },
    {
      role: "Full-Stack & Machine Learning Developer",
      company: "Independent Projects & Open Source",
      period: "2024 — Present",
      location: "Remote",
      bullets: [
        "Engineered the Heart Attack Risk Prediction clinical web application using Python, Flask, and Scikit-Learn.",
        "Created ML-All, an open collection of machine learning algorithms, model evaluation pipelines, and datasets.",
        "Designed and deployed modern, interactive web applications on Vercel, Render, and GitHub Pages."
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 7. Social Links
  // --------------------------------------------------------------------------
  socials: {
    github: "https://github.com/aditaya-raj06",
    linkedin: "https://www.linkedin.com/in/aditayaraj06",
    instagram: "https://www.instagram.com/aditaya_.raj/",
    twitter: "https://x.com/Aditaya0612",
    email: "mailto:adityarajraja01@gmail.com"
  }
};

// Expose globally for direct file:// browser execution without CORS restrictions
if (typeof window !== 'undefined') {
  window.portfolioData = portfolioData;
}
