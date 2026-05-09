import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PulseProvider, usePulse } from './context/PulseContext';
import BootSequence from './components/ui/BootSequence';
import CircuitCanvas from './components/canvas/CircuitCanvas';
import TraceNetwork from './components/canvas/TraceNetwork';
import LEDNode from './components/canvas/LEDNode';
import HeatZone from './components/canvas/HeatZone';

// --- DEFAULT DATA (Fallback if localStorage is empty) ---
const DEFAULT_PORTFOLIO_DATA = {
  personal: {
    fullName: 'A.B.D. Anandakumara',
    title: 'Software Engineer',
    heroTitle: 'Crafting the Future of Connected Systems',
    heroSubtitle: 'I specialize in building intelligent, scalable platforms at the intersection of web technology and embedded hardware.',
    email: 'buddhikadarshan1475@gmail.com',
    linkedin: 'https://linkedin.com/in/buddhika-darshan-anandakumara',
    github: 'https://github.com/BuddhikaBICT-UoR-FoT-6'
  },
  about: {
    profile: 'As a passionate Full-Stack Developer and IoT enthusiast, I bridge the gap between physical hardware and scalable digital interfaces. Currently pursuing a B.Sc. (Hons) in Information and Communication Technology at the University of Ruhuna, I thrive on designing systems that are not only performant but intuitively interactive.\n\nMy expertise spans Spring Boot microservices, high-performance React frontends, and embedded device programming (ESP32/Arduino). I believe in clean code, robust architecture, and creating immersive user experiences.',
    highlights: ['IoT Systems Integration', 'Full-Stack Architecture', 'Real-time Data Streaming', 'Agile & TDD Methodologies', 'Cloud Deployment']
  },
  skills: {
    technical: ['React & Next.js', 'Spring Boot (Java)', 'Tailwind CSS / Material UI', 'MQTT / WebSockets', 'Node.js & Express', 'MongoDB / MySQL / Redis', 'C++ / Embedded C', 'Docker & CI/CD'],
    soft: ['Complex Problem Solving', 'Cross-functional Collaboration', 'Technical Leadership', 'Rapid Learning', 'Agile Methodologies']
  },
  projects: [
    { title: 'HomeCanvas', badge: 'IoT / Web', icon: '🏠', desc: 'An end-to-end smart home platform integrating an ESP32 micro-controller and sensor fusion for real-time home monitoring.', tech: ['Java', 'Spring Boot', 'React.js', 'ESP32'], liveUrl: 'https://homecanvas99.netlify.app/', codeUrl: 'https://github.com/BuddhikaBICT-UoR-FoT-6/HomeCanvas.git' },
    { title: 'CrowdFlow', badge: 'Mobile', icon: '🗺️', desc: 'A map-first Android platform backed by a highly scalable data pipeline, enabling users to visualize localized traffic conditions.', tech: ['Kotlin', 'Node.js', 'MongoDB', 'Redis'], liveUrl: '', codeUrl: 'https://github.com/BuddhikaBICT-UoR-FoT-6/CrowdFlow.git' },
    { title: 'BoutiqueFlow', badge: 'Web', icon: '👗', desc: 'A full-stack digital management platform built to transition a physical clothing shop online, featuring secure real-time inventory tracking.', tech: ['Angular', 'Node.js', 'Express', 'MongoDB'], liveUrl: 'https://abdclothingstore.netlify.app/', codeUrl: 'https://github.com/BuddhikaBICT-UoR-FoT-6/BoutiqueFlow.git' },
    { title: 'Cypher-UI', badge: 'Web', icon: '🔐', desc: 'An educational platform bridging theoretical cryptography with hands-on implementation, featuring real-time encryption visualizations.', tech: ['React.js', 'Node.js', 'MySQL'], liveUrl: 'https://cipher-ui-zeta.vercel.app/', codeUrl: 'https://github.com/BuddhikaBICT-UoR-FoT-6/cipher-ui.git' },
    { title: 'Smart Campus', badge: 'Mobile', icon: '🎓', desc: 'A production-grade, multi-role Flutter application that digitizes and centralizes administrative and academic workflows.', tech: ['Flutter', 'Dart', 'Provider', 'SQLite'], liveUrl: '', codeUrl: 'https://github.com/BuddhikaBICT-UoR-FoT-6/smart_campus.git' },
    { title: 'Earn++', badge: 'Mobile', icon: '📈', desc: 'A cross-platform mobile application providing beginner investors with a streamlined, dollar-based alternative to complex spreadsheet portfolio management.', tech: ['Flutter', 'Dart Shelf', 'MySQL'], liveUrl: '', codeUrl: 'https://github.com/BuddhikaBICT-UoR-FoT-6/EarnPlusPlus.git' },
    { title: 'Secure Environment Variable Vault', badge: 'Desktop', icon: '🔒', desc: 'A desktop utility application designed to securely manage, organize, and edit .env files for local development repositories.', tech: ['Java', 'JavaFX', 'SQL'], liveUrl: '', codeUrl: 'https://github.com/BuddhikaBICT-UoR-FoT-6/Secure-Environment-Variable-Vault.git' }
  ]
};

// UI Sections
const NavBar = ({ fullName }) => (
  <nav className="flex justify-between items-center mb-24 relative z-40 bg-[#0a1a0a]/85 backdrop-blur-md border border-green-500/30 rounded-xl p-4 mt-6 shadow-[0_0_20px_rgba(0,255,68,0.1)]">
    <div className="text-xl font-bold font-mono text-green-400 flex items-center gap-2">
      <span>{fullName}</span>
      <span className="w-2 h-4 bg-green-500 animate-pulse"></span>
    </div>
    <div className="hidden md:flex gap-6 text-sm font-mono tracking-widest text-zinc-400">
      {['About', 'Projects', 'Skills', 'Contact'].map(item => (
        <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-green-400 transition-colors">
          ./{item.toLowerCase()}
        </a>
      ))}
    </div>
    <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]"></span> API: ONLINE</span>
      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]"></span> MQTT: OK</span>
    </div>
  </nav>
);

const AdminLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'buddhika2026') {
      onSuccess();
    } else {
      alert("Invalid Access Code");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#050a05] border border-green-500/50 p-8 rounded-xl w-full max-w-sm shadow-[0_0_50px_rgba(0,255,68,0.2)]">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-zinc-100 font-mono">ROOT_ACCESS</h2>
          <p className="text-sm text-green-400 font-mono mt-2">Authentication required</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} placeholder="ENTER_PASSKEY..." className="w-full bg-black/50 border border-green-500/30 rounded p-3 text-zinc-100 font-mono outline-none focus:border-green-500 transition-colors" />
          <div className="flex gap-3 font-mono">
            <button type="submit" className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded transition-colors shadow-[0_0_15px_rgba(0,255,68,0.3)]">UNLOCK</button>
            <button type="button" onClick={onClose} className="flex-1 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold py-3 rounded transition-colors">ABORT</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AboutSection = ({ data, profilePhoto }) => (
  <section id="about" className="py-24 relative z-30">
    <div className="container mx-auto px-6">
      <div className="mb-12 border-l-4 border-green-500 pl-4">
        <span className="text-green-500 font-mono text-sm tracking-widest uppercase block">./whoami</span>
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mt-2">About</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="flex flex-col gap-6">
          {profilePhoto && (
            <div className="w-48 h-48 rounded-xl overflow-hidden border border-green-500/50 shadow-[0_0_30px_rgba(0,255,68,0.2)] grayscale hover:grayscale-0 transition-all duration-500">
              <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="bg-[#0a1a0a]/85 backdrop-blur-md border border-green-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(0,255,68,0.1)] flex-1">
            <h3 className="text-2xl font-bold text-green-400 mb-4 font-mono">Profile</h3>
            {data.profile.split('\n\n').map((p, i) => (
              <p key={i} className="text-zinc-400 leading-relaxed mb-4 last:mb-0">{p}</p>
            ))}
          </div>
        </div>
        <div className="bg-[#0a1a0a]/85 backdrop-blur-md border border-green-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(0,255,68,0.1)] self-start">
          <h3 className="text-2xl font-bold text-green-400 mb-4 font-mono">System_Highlights</h3>
          <ul className="space-y-3 text-zinc-300 font-mono text-sm">
            {data.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5 animate-pulse">›</span> 
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const ProjectsSection = ({ projects }) => {
  const { dispatchPulse } = usePulse();
  return (
    <section id="projects" className="py-24 relative z-30">
      <div className="container mx-auto px-6">
        <div className="mb-12 border-l-4 border-green-500 pl-4">
          <span className="text-green-500 font-mono text-sm tracking-widest uppercase block">./ls -la projects</span>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mt-2">Projects</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <motion.div 
              key={i} 
              onMouseEnter={(e) => dispatchPulse(e.clientX, e.clientY)}
              whileHover={{ y: -5, boxShadow: "0 0 30px rgba(0,255,68,0.2)" }} 
              className="bg-[#0a1a0a]/85 backdrop-blur-md border border-green-500/30 hover:border-green-500/60 rounded-xl p-6 flex flex-col transition-all overflow-hidden group cursor-crosshair"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{p.icon || '🚀'}</span>
                  <h3 className="text-xl font-bold text-green-300">{p.title}</h3>
                </div>
                {p.badge && <span className="text-[10px] font-mono bg-green-900/40 text-green-400 px-2 py-1 rounded border border-green-500/30 whitespace-nowrap">{p.badge}</span>}
              </div>
              <p className="text-zinc-400 text-sm mb-6 flex-1">{p.description || p.desc}</p>
              {p.tech && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.tech.map(t => <span key={t} className="text-[10px] font-mono text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/20">{t}</span>)}
                </div>
              )}
              <div className="flex gap-4 text-sm font-mono font-bold mt-auto border-t border-green-500/20 pt-4">
                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-green-400 hover:text-white transition-colors">LIVE_URL ↗</a>}
                {p.codeUrl && <a href={p.codeUrl} target="_blank" rel="noreferrer" className="text-green-400 hover:text-white transition-colors">SOURCE ↗</a>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SkillsSection = ({ skills }) => {
  return (
    <section id="skills" className="py-24 relative z-30">
      <div className="container mx-auto px-6">
        <div className="mb-12 border-l-4 border-green-500 pl-4">
          <span className="text-green-500 font-mono text-sm tracking-widest uppercase block">./cat skills.json</span>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mt-2">Skills & Certifications</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#0a1a0a]/85 backdrop-blur-md border border-green-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(0,255,68,0.1)]">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6 font-mono">Tech_Stack</h3>
            <div className="flex flex-wrap gap-3">
              {skills.technical.map((s, i) => (
                <div key={i} className="flex items-center gap-2 bg-green-900/20 border border-green-500/30 px-3 py-2 rounded text-sm text-zinc-300 font-mono">
                  {s}
                  <div className="flex gap-0.5 ml-2">
                    {[1,2,3,4].map(bar => (
                      <div key={bar} className={`w-1 h-${Math.random() > 0.5 ? '3' : '2'} bg-green-500 animate-pulse`} style={{animationDelay: `${Math.random()}s`}}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0a1a0a]/85 backdrop-blur-md border border-green-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(0,255,68,0.1)]">
            <h3 className="text-2xl font-bold text-green-400 mb-6 font-mono">Certifications</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-900/20 border border-green-500/30 rounded flex justify-between items-center hover:bg-green-900/40 transition-colors">
                <div>
                  <h4 className="font-bold text-zinc-200">Oracle Cloud Infrastructure</h4>
                  <p className="text-xs text-zinc-400 font-mono mt-1">Foundations Associate</p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">Oct 2025</span>
              </div>
              <div className="p-4 bg-green-900/20 border border-green-500/30 rounded flex justify-between items-center hover:bg-green-900/40 transition-colors">
                <div>
                  <h4 className="font-bold text-zinc-200">Front End Development Libraries</h4>
                  <p className="text-xs text-zinc-400 font-mono mt-1">freeCodeCamp</p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">Sep 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = ({ email, linkedin, github }) => (
  <section id="contact" className="py-24 relative z-30">
    <div className="container mx-auto px-6">
      <div className="bg-[#0a1a0a]/90 backdrop-blur-md border border-green-500/40 rounded-2xl p-12 max-w-3xl mx-auto shadow-[0_0_50px_rgba(0,255,68,0.15)] font-mono">
        <h2 className="text-2xl font-bold text-green-400 mb-6">TRANSMIT_TO:</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {email && <a href={`mailto:${email}`} className="flex-1 px-8 py-4 bg-green-900/30 border border-green-500/50 rounded font-bold hover:bg-green-600 hover:text-white transition-colors text-center text-green-300">EMAIL_NODE</a>}
          {linkedin && <a href={linkedin} target="_blank" rel="noreferrer" className="flex-1 px-8 py-4 bg-green-900/30 border border-green-500/50 rounded font-bold hover:bg-green-600 hover:text-white transition-colors text-center text-green-300">LINKEDIN_NODE</a>}
          {github && <a href={github} target="_blank" rel="noreferrer" className="flex-1 px-8 py-4 bg-green-900/30 border border-green-500/50 rounded font-bold hover:bg-green-600 hover:text-white transition-colors text-center text-green-300">GITHUB_REPO</a>}
        </div>
      </div>
    </div>
  </section>
);

function MainApp() {
  const { dispatchPulse } = usePulse();
  
  // Dynamic State
  const [portfolioData, setPortfolioData] = useState(DEFAULT_PORTFOLIO_DATA);
  const [profilePhoto, setProfilePhoto] = useState('/profile.png');
  const [resumeData, setResumeData] = useState(null);
  const [resumeName, setResumeName] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [bootPlayed, setBootPlayed] = useState(false);
  
  // Rotating Subtitles
  const subtitles = ["IoT Engineer", "React Developer", "Spring Boot Architect", "Embedded Systems Enthusiast"];
  const [subIdx, setSubIdx] = useState(0);

  useEffect(() => {
    // Check if boot played
    if (sessionStorage.getItem('bootPlayed')) {
      setBootPlayed(true);
    }

    const interval = setInterval(() => {
      setSubIdx(prev => (prev + 1) % subtitles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [subtitles.length]);

  useEffect(() => {
    // Load dynamic data from localStorage
    try {
      const storedData = localStorage.getItem('portfolioData');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed.projects && parsed.projects.length >= 5) {
          setPortfolioData(parsed);
        }
      }
      const storedPhoto = localStorage.getItem('profilePhoto');
      if (storedPhoto) setProfilePhoto(storedPhoto);

      const storedResumeData = localStorage.getItem('resumeData');
      const storedResumeName = localStorage.getItem('resumeName');
      if (storedResumeData) {
        setResumeData(storedResumeData);
        setResumeName(storedResumeName || 'ABD_Anandakumara_CV.pdf');
      }
    } catch (e) {
      console.error('Error loading dynamic data:', e);
    }
  }, []);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setShowAdminLogin(true);
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  if (!bootPlayed) {
    return <BootSequence onComplete={() => {
      sessionStorage.setItem('bootPlayed', 'true');
      setBootPlayed(true);
    }} />;
  }

  return (
    <div 
      className="min-h-screen bg-[#050a05] font-sans text-zinc-100 overflow-x-hidden selection:bg-green-500/30"
      onClick={(e) => dispatchPulse(e.clientX, e.clientY)}
    >
      {/* Circuit Board Image & Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/assets/deep_purple_pcb.png" alt="" className="w-full h-full object-cover fixed opacity-80" />
        <div className="absolute inset-0 bg-[#050a05]/65 backdrop-blur-[2px]"></div>
      </div>

      {/* Physics Canvas Engine */}
      <CircuitCanvas />
      <TraceNetwork />
      
      {/* Environmental Lighting */}
      <LEDNode top="25%" left="15%" color="#ff2200" />
      <LEDNode top="45%" left="80%" color="#00ff44" />
      <LEDNode top="70%" left="25%" color="#ff8800" />
      <LEDNode top="10%" left="40%" color="#00ff44" />
      <LEDNode top="85%" left="60%" color="#ff2200" />
      <HeatZone top="30%" left="70%" size={400} />
      <HeatZone top="70%" left="20%" size={300} />

      <div className="relative z-30 container mx-auto px-6 py-4 flex flex-col min-h-screen cursor-crosshair">
        <NavBar fullName={portfolioData.personal.fullName} />

        {/* HERO SECTION */}
        <div className="flex-1 grid lg:grid-cols-2 gap-12 items-center py-24">
          <div className="space-y-8">
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
              <div className="text-2xl font-mono text-green-400 mb-4 h-8 flex items-center">
                <span className="mr-2 text-zinc-400">./load</span>
                <AnimatePresence mode="wait">
                  <motion.span key={subIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    {subtitles[subIdx]}
                  </motion.span>
                </AnimatePresence>
                <span className="animate-pulse ml-1">_</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-4 text-zinc-100">
                {portfolioData.personal.fullName}
              </h1>
              <p className="text-lg text-zinc-400 max-w-lg leading-relaxed font-mono">
                {portfolioData.personal.heroSubtitle}
              </p>
            </motion.div>
            <div className="flex gap-4">
              <motion.button 
                onClick={(e) => {
                  e.stopPropagation();
                  dispatchPulse(e.clientX, e.clientY);
                  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(0,255,68,0.5)" }} 
                whileTap={{ scale: 0.98 }} 
                className="px-8 py-4 bg-green-600/90 rounded font-bold shadow-[0_0_15px_rgba(0,255,68,0.3)] transition-all font-mono hover:bg-green-500 border border-green-400"
              >
                ./VIEW_PROJECTS
              </motion.button>
              {resumeData && (
                <motion.a 
                  href={resumeData} 
                  download={resumeName}
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ background: "rgba(34,211,238,0.1)", borderColor: "rgba(34,211,238,0.5)" }} 
                  className="inline-flex items-center px-8 py-4 border border-cyan-500/30 text-cyan-400 rounded font-bold transition-colors font-mono bg-black/30 backdrop-blur-sm"
                >
                  ↓ FETCH_CV
                </motion.a>
              )}
            </div>
          </div>
        </div>

        <AboutSection data={portfolioData.about} profilePhoto={profilePhoto} />
        <ProjectsSection projects={portfolioData.projects} />
        <SkillsSection skills={portfolioData.skills} />
        <ContactSection email={portfolioData.personal.email} linkedin={portfolioData.personal.linkedin} github={portfolioData.personal.github} />

        <footer className="mt-auto pt-12 flex justify-between items-center text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase bg-[#0a1a0a]/80 p-4 rounded-t-xl border-t border-green-500/30">
          <div className="flex items-center gap-4">
            <div>UPTIME: <span className="text-green-400">99.99%</span></div>
            <div>MEM_ALLOC: <span className="text-cyan-400">241MB/1024MB</span></div>
          </div>
          <div>FIRMWARE v2.4.1 (React + Spring Boot)</div>
        </footer>
      </div>

      <AdminLoginModal 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)}
        onSuccess={() => {
          sessionStorage.setItem('adminAuth', 'true');
          window.location.href = '/admin.html';
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <PulseProvider>
      <MainApp />
    </PulseProvider>
  );
}
