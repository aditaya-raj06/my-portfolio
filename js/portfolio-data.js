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
    name: "Aditya Raj",
    monogram: "AR",
    title: "Full-Stack Software Engineer & AI Architect",
    availability: "Available for High-Impact Roles & Projects",
    isAvailable: true,
    location: "Bengaluru / Remote",
    timezone: "Asia/Kolkata (IST)",
    email: "adityaraj.dev@example.com", // Aapka actual email yahan daalein
    resumeUrl: "#", // Resume PDF file ka path (e.g., "assets/Aditya_Resume.pdf")
    tagline: "Architecting resilient web applications, distributed backend systems, and AI-driven solutions that drive measurable business outcomes.",
    bio: [
      "I engineer modern digital products at the intersection of high-performance backend architecture, intuitive user interfaces, and applied AI systems.",
      "Passionate about building scalable cloud-native architectures, low-latency microservices, and slick, responsive frontend experiences that solve mission-critical problems."
    ],
  },

  // --------------------------------------------------------------------------
  // 2. Dynamic Typing Roles in Hero Header
  // --------------------------------------------------------------------------
  typingRoles: [
    "Full-Stack Software Engineer",
    "Cloud & Distributed Systems Architect",
    "Applied AI & LLM Systems Developer",
    "Creative Problem Solver"
  ],

  // --------------------------------------------------------------------------
  // 3. High-Impact Highlights / Metrics (Bento Grid)
  // --------------------------------------------------------------------------
  metrics: [
    { number: "3+", label: "Years Experience" },
    { number: "18+", label: "Production Apps Shipped" },
    { number: "99.9%", label: "System Uptime Track Record" },
    { number: "250K+", label: "Active Monthly Users Handled" }
  ],

  // --------------------------------------------------------------------------
  // 4. Featured Projects (Case-Study & Metric Driven)
  // --------------------------------------------------------------------------
  // Categories: "all", "fullstack", "ai-ml", "cloud-systems"
  projects: [
    {
      id: "ai-flow-engine",
      title: "OmniFlow - AI Workflow Automation Platform",
      category: "ai-ml",
      categoryLabel: "AI & Distributed Systems",
      description: "An agentic AI execution platform connecting multi-model LLM chains with real-time enterprise tool dispatch and state orchestration.",
      impact: "⚡ Reduced automated processing latency by 44% across 50k+ runs",
      technologies: ["Next.js", "Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      image: "assets/images/project-ai.svg"
    },
    {
      id: "hyper-commerce",
      title: "PulseStore - Real-Time High-Throughput E-Commerce",
      category: "fullstack",
      categoryLabel: "Full Stack & Web",
      description: "Next-generation e-commerce web platform engineered with server-side streaming, optimistic UI updates, and sub-100ms product catalog search.",
      impact: "📈 Boosted checkout conversion by 28% and cut bounce rates in half",
      technologies: ["React", "Node.js", "TypeScript", "TailwindCSS", "Stripe API"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      image: "assets/images/project-commerce.svg"
    },
    {
      id: "cloud-telemetry",
      title: "CloudPulse - Observability & Telemetry Pipeline",
      category: "cloud-systems",
      categoryLabel: "Cloud & DevOps",
      description: "Scalable event ingestion and metrics dashboard processing live logs and performance anomalies with automated alerting.",
      impact: "🛡️ Handled 1.2M+ telemetry events per day with zero data loss",
      technologies: ["Go", "Kafka", "Kubernetes", "Prometheus", "Grafana"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      image: "assets/images/project-cloud.svg"
    },
    {
      id: "vector-search",
      title: "NeuroDoc - Semantic Document Intelligence Hub",
      category: "ai-ml",
      categoryLabel: "AI & NLP",
      description: "Retrieval-Augmented Generation (RAG) system with hybrid sparse/dense vector search for technical documentation querying.",
      impact: "🎯 94% precision score with under 80ms retrieval turnaround",
      technologies: ["Python", "LangChain", "Qdrant", "OpenAI API", "Vue.js"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      image: "assets/images/project-search.svg"
    }
  ],

  // --------------------------------------------------------------------------
  // 5. Skills & Core Competencies
  // --------------------------------------------------------------------------
  skills: [
    {
      category: "Frontend & UI Engineering",
      icon: "layout",
      items: [
        { name: "React.js / Next.js", level: "Advanced", percentage: 92 },
        { name: "Modern JavaScript (ESNext) / TypeScript", level: "Advanced", percentage: 95 },
        { name: "CSS3 / Modern Layouts & Animations", level: "Expert", percentage: 96 },
        { name: "State Management & Responsive Design", level: "Advanced", percentage: 90 }
      ]
    },
    {
      category: "Backend & Systems",
      icon: "server",
      items: [
        { name: "Node.js / Express / Fastify", level: "Advanced", percentage: 90 },
        { name: "Python / FastAPI", level: "Advanced", percentage: 88 },
        { name: "PostgreSQL / MongoDB / Redis", level: "Advanced", percentage: 86 },
        { name: "RESTful & GraphQL APIs", level: "Expert", percentage: 94 }
      ]
    },
    {
      category: "Cloud, DevOps & Tooling",
      icon: "cloud",
      items: [
        { name: "Docker & Containerization", level: "Intermediate", percentage: 82 },
        { name: "AWS / Google Cloud / Vercel", level: "Advanced", percentage: 85 },
        { name: "CI/CD Pipelines (GitHub Actions)", level: "Advanced", percentage: 88 },
        { name: "Git / Agile Collaboration", level: "Expert", percentage: 95 }
      ]
    },
    {
      category: "AI & Applied Intelligence",
      icon: "cpu",
      items: [
        { name: "LLM Orchestration & Prompting", level: "Advanced", percentage: 90 },
        { name: "RAG & Vector Databases", level: "Intermediate", percentage: 84 },
        { name: "Agentic Workflows & Tool Calling", level: "Advanced", percentage: 86 },
        { name: "Data Pipelines & Preprocessing", level: "Intermediate", percentage: 80 }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 6. Experience & Career Milestones
  // --------------------------------------------------------------------------
  experience: [
    {
      role: "Senior Software Engineer / Tech Lead",
      company: "InnovateTech Labs",
      period: "2024 — Present",
      location: "Bengaluru, India",
      bullets: [
        "Led a squad of 6 engineers architecting enterprise workflow software serving 100k+ global users.",
        "Engineered distributed caching with Redis that lowered database queries by 45%.",
        "Pioneered automated testing and CI/CD protocols, reducing regression bugs by 60%."
      ]
    },
    {
      role: "Full-Stack Software Engineer",
      company: "Nexis Cloud Solutions",
      period: "2022 — 2024",
      location: "Remote",
      bullets: [
        "Engineered responsive single-page web applications with React, TypeScript, and Node.js microservices.",
        "Refactored legacy REST endpoints, improving median page response time from 1.2s down to 320ms.",
        "Integrated payment gateways, real-time WebSockets, and OAuth2 security authentication."
      ]
    },
    {
      role: "Software Engineering Intern",
      company: "Cognitive Systems Inc.",
      period: "2021 — 2022",
      location: "Bengaluru, India",
      bullets: [
        "Built internal tooling and automated scrapers in Python for data analytics pipelines.",
        "Developed frontend dashboard components that enabled client teams to visualize operational KPIs."
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 7. Social Links
  // --------------------------------------------------------------------------
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    email: "mailto:adityaraj.dev@example.com"
  }
};

// Expose globally for direct file:// browser execution without CORS restrictions
if (typeof window !== 'undefined') {
  window.portfolioData = portfolioData;
}
