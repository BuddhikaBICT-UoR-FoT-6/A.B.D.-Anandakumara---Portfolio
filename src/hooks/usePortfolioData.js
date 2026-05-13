import { useState, useEffect } from 'react';

const DEFAULT_DATA = {
  personal: {
    fullName: 'A.B.D. Anandakumara',
    title: 'BICT Undergraduate | Full-Stack Developer | OCI Certified',
    heroTitle: 'I build software that works as good as it looks.',
    heroSubtitle: "I'm A.B.D. Anandakumara — a final-year engineer who turns complex problems into clean, scalable, and impactful software.",
    email: 'buddhikadarshan1475@gmail.com',
    github: 'https://github.com/BuddhikaBICT-UoR-FoT-6',
    linkedin: 'https://www.linkedin.com/in/buddhika-darshan-9b9168252/'
  },
  about: {
    profile: `I am a Full-Stack Software Engineer and BICT undergraduate specializing in building scalable, AI-integrated applications. From architecting agentic IoT smart environments to developing semantic search engines, I bridge the gap between robust backend systems (Java/Spring Boot, Node.js) and intuitive, modern frontends (React, Flutter). Driven by a passion for clean code and cloud-ready infrastructure (GCP, Oracle Cloud), I thrive on solving complex system architecture challenges.`,
    highlights: [
      '🎓 Final Year BICT at University of Ruhuna',
      '☁️ Oracle Certified Foundations Associate (OCI)',
      '🤖 Built HomeCanvas (Gemini AI, ESP32, Spring Boot)',
      '📱 Built Smart Campus (Offline-first Flutter platform)',
      '🚌 Built CeylonQueueBusPulse (Real-time tracking)',
      '💳 Integrated Stripe & PayPal for BoutiqueFlow',
      '🧪 95%+ Jest coverage on Cypher-UI engine',
      '🚀 Deployed via GCP, Docker, Vercel & Netlify'
    ]
  },
  skills: {
    technical: [
      'Spring Boot / Java',
      'React / Flutter',
      'Node.js / Express',
      'JavaScript / TypeScript',
      'Kotlin / Android',
      'MongoDB / MySQL / SQLite',
      'Cloud (GCP / OCI)',
      'Docker / CI-CD'
    ],
    soft: ['Communication', 'Teamwork', 'Problem-solving', 'Git & GitHub', 'REST API Design', 'Jest Testing', 'Redis Caching', 'Cryptography']
  },
  projects: [
    {
      title: 'HomeCanvas',
      badge: 'IoT / Web',
      icon: '🏠',
      description: 'An end-to-end smart home platform integrating an ESP32 micro-controller and sensor fusion for real-time home monitoring, actionable alerts, and a secure centralized dashboard.',
      tech: ['Java', 'Spring Boot', 'React.js', 'TypeScript', 'ESP32', 'SQL'],
      liveUrl: 'https://homecanvas99.netlify.app/',
      codeUrl: 'https://github.com/BuddhikaBICT-UoR-FoT-6/HomeCanvas.git'
    },
    {
      title: 'CrowdFlow',
      badge: 'Mobile',
      icon: '🗺️',
      description: 'A map-first Android platform backed by a highly scalable data pipeline, enabling users to visualize localized traffic conditions and seamlessly submit real-time severity feedback.',
      tech: ['Kotlin', 'Node.js', 'MongoDB', 'Redis'],
      liveUrl: '',
      codeUrl: 'https://github.com/BuddhikaBICT-UoR-FoT-6/CrowdFlow.git'
    },
    {
      title: 'BoutiqueFlow',
      badge: 'Web',
      icon: '👗',
      description: 'A full-stack digital management platform built to transition a physical clothing shop online, featuring secure real-time inventory tracking, RBAC, and automated digital sales processing.',
      tech: ['Angular', 'Node.js', 'Express', 'MongoDB'],
      liveUrl: 'https://abdclothingstore.netlify.app/',
      codeUrl: 'https://github.com/BuddhikaBICT-UoR-FoT-6/BoutiqueFlow.git'
    },
    {
      title: 'Cypher-UI',
      badge: 'Web',
      icon: '🔐',
      description: 'An educational platform bridging theoretical cryptography with hands-on implementation, featuring real-time encryption visualizations and brute-force simulators to accelerate concept understanding.',
      tech: ['React.js', 'Node.js', 'MySQL'],
      liveUrl: 'https://cipher-ui-zeta.vercel.app/',
      codeUrl: 'https://github.com/BuddhikaBICT-UoR-FoT-6/cipher-ui.git'
    },
    {
      title: 'Smart Campus',
      badge: 'Mobile',
      icon: '🎓',
      description: 'A production-grade, multi-role Flutter application that digitizes and centralizes administrative and academic workflows with an offline-first architecture for low-connectivity environments.',
      tech: ['Flutter', 'Dart', 'Provider', 'SQLite', 'MySQL', 'Clean Architecture'],
      liveUrl: '',
      codeUrl: 'https://github.com/BuddhikaBICT-UoR-FoT-6/smart_campus.git'
    },
    {
      title: 'Earn++',
      badge: 'Mobile',
      icon: '📈',
      description: 'A cross-platform mobile application providing beginner investors with a streamlined, dollar-based alternative to complex spreadsheet portfolio management with real-time profit/loss calculations.',
      tech: ['Flutter', 'Dart Shelf', 'MySQL'],
      liveUrl: '',
      codeUrl: 'https://github.com/BuddhikaBICT-UoR-FoT-6/EarnPlusPlus.git'
    },
    {
      title: 'Secure Vault',
      badge: 'Desktop',
      icon: '🔒',
      description: 'A desktop utility application designed to securely manage, organize, and edit .env files for local development repositories with encrypted backup generation capabilities.',
      tech: ['Java', 'JavaFX', 'SQL'],
      liveUrl: '',
      codeUrl: 'https://github.com/BuddhikaBICT-UoR-FoT-6/Secure-Environment-Variable-Vault.git'
    }
  ]
};

export function usePortfolioData() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_DATA;
      }
    }
    return DEFAULT_DATA;
  });

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'portfolioData') {
        try {
          setData(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return data;
}
