import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import BootSequence from './components/ui/BootSequence';
import CircuitRenderer from './canvas/CircuitRenderer';

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
    profile: "I am an innovative Full-Stack Software Engineer with a proven track record of architecting scalable, enterprise-level applications — from cloud-ready transit platforms to comprehensive retail management systems.\n\nBy leveraging a diverse tech stack including React, Angular, Node.js, and Kotlin, I build robust solutions featuring resilient REST APIs and intuitive, user-centric interfaces. I'm passionate about tackling complex technical challenges and delivering high-quality, impactful software.\n\nWhen I'm not building or debugging, I explore emerging tech like Azure Cloud, Redis, and cryptography. Open for internships and collaborations.",
    highlights: [
      'Oracle Certified Foundations Associate (OCI)',
      'Final Year BICT at University of Ruhuna',
      'Built Smart Campus — offline-first Flutter university platform',
      'Built CeylonQueueBusPulse — real-time transit platform',
      'Integrated Stripe & PayPal payment gateways (BoutiqueFlow)',
      'IoT smart home system with ESP32 (HomeCanvas)',
      '95%+ test coverage on Cypher-UI (Jest)',
      'Deployed apps on Azure, Vercel, Netlify & Railway'
    ]
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

// --- CUSTOM MODULES ---
const SystemCore = () => (
  <motion.div 
    animate={{ boxShadow: [`0 0 20px #a855f7`, `0 0 40px #22d3ee`, `0 0 20px #a855f7`] }}
    transition={{ duration: 4, repeat: Infinity }}
    className="relative w-64 h-64 border border-purple-500/50 rounded-full flex items-center justify-center bg-[#0a0212]/80 backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.2)] pointer-events-auto"
  >
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-2 border border-dashed border-cyan-500/30 rounded-full pointer-events-none" />
    <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-6 border border-dotted border-purple-500/40 rounded-full pointer-events-none" />
    <div className="text-center pointer-events-none">
      <div className="text-xs font-mono text-cyan-400 mb-1 tracking-widest">SYSTEM_CORE</div>
      <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">ACTIVE</div>
      <div className="mt-2 text-[10px] font-mono text-zinc-500">
        <div>CPU_LOAD: <span className="text-purple-400">24%</span></div>
        <div>MEM_ALLOC: <span className="text-cyan-400">1.2GB</span></div>
        <div>CORE_TEMP: <span className="text-purple-400">42°C</span></div>
      </div>
    </div>
  </motion.div>
);

const HoverModule = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="w-64 border rounded-xl p-6 backdrop-blur-md transition-colors duration-500 border-cyan-500/50 bg-[#0a0212]/90 shadow-[0_0_30px_rgba(34,211,238,0.2)] pointer-events-auto"
  >
    <div className="flex justify-between items-center mb-4">
      <span className="text-xs font-mono text-purple-400 tracking-wider">ENV_SCANNER</span>
      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
    </div>
    <div className="h-1 w-full bg-zinc-800 rounded overflow-hidden mb-4">
      <motion.div 
        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </div>
    <ul className="space-y-3 text-zinc-300 text-sm font-mono">
      <li className="flex items-start gap-3">
        <span className="text-cyan-500 mt-0.5">›</span>
        <span>B.Sc. BICT (Hons) Undergraduate</span>
      </li>
      <li className="flex items-start gap-3">
        <span className="text-cyan-500 mt-0.5">›</span>
        <span>IoT & Full-Stack Architect</span>
      </li>
      <li className="flex items-start gap-3">
        <span className="text-cyan-500 mt-0.5">›</span>
        <span>Oracle Certified Foundations</span>
      </li>
    </ul>
  </motion.div>
);

const Typewriter = ({ strings }) => {
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullString = strings[currentStringIndex];
      
      if (!isDeleting) {
        setCurrentText(fullString.substring(0, currentText.length + 1));
        if (currentText === fullString) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setCurrentText(fullString.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentStringIndex((prev) => (prev + 1) % strings.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentStringIndex, strings]);

  return (
    <span className="text-cyan-400 border-r-2 border-cyan-400 pr-1 animate-[pulse_1s_ease-in-out_infinite]">
      {currentText}
    </span>
  );
};

// --- UI SECTIONS ---
const NavBar = ({ fullName }) => (
  <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none">
    <nav className="container mx-auto pointer-events-auto flex justify-between items-center bg-[#0a0212]/80 backdrop-blur-md border border-purple-500/20 rounded-xl p-4 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
      <div className="text-xl font-bold font-mono text-purple-400 flex items-center gap-2">
        <span className="bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">{fullName}</span>
      </div>
      <div className="hidden md:flex gap-6 text-sm font-mono tracking-widest text-zinc-400">
        {['About', 'Projects', 'Skills', 'Contact'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-purple-400 transition-colors">
            {item}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 hidden sm:flex">
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]"></span> API: ONLINE</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]"></span> MQTT: OK</span>
      </div>
    </nav>
  </div>
);

const AdminLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'buddhika2026') onSuccess(); else alert("Invalid Access Code");
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0a0212] border border-purple-500/50 p-8 rounded-xl w-full max-w-sm shadow-[0_0_50px_rgba(168,85,247,0.2)]">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-zinc-100 font-sans">Admin Access</h2>
          <p className="text-sm text-cyan-400 font-mono mt-2">Authentication required</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password..." className="w-full bg-black/50 border border-purple-500/30 rounded p-3 text-zinc-100 font-mono outline-none focus:border-cyan-500 transition-colors pointer-events-auto" />
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)] pointer-events-auto">Unlock</button>
            <button type="button" onClick={onClose} className="flex-1 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold py-3 rounded transition-colors pointer-events-auto">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AboutSection = ({ data, profilePhoto }) => (
  <section id="about" className="py-24 relative z-30 pointer-events-auto">
    <div className="container mx-auto px-6">
      <div className="mb-12 pointer-events-none">
        <span className="text-cyan-500 font-mono text-sm tracking-widest uppercase block mb-2">Who I Am</span>
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mt-2">About</h2>
      </div>
      <div className="grid md:grid-cols-[1fr_2fr] lg:grid-cols-[280px_1fr_1fr] gap-8 items-start">
        <div className="flex flex-col items-center gap-6">
          {profilePhoto && (
            <div className="relative group pointer-events-auto">
              <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.2)] transition-transform duration-500 group-hover:scale-105">
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0a0212] border border-purple-500/50 text-zinc-300 text-xs px-5 py-2.5 rounded-full font-mono flex items-center gap-2.5 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_#22c55e]"></span>
                Open to work
              </div>
            </div>
          )}
        </div>
        <div className="bg-[#0a0212]/80 backdrop-blur-md border border-purple-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(168,85,247,0.1)] h-full pointer-events-auto">
          <h3 className="text-2xl font-bold text-purple-400 mb-6 font-sans">Profile</h3>
          <div className="space-y-4 text-zinc-400 leading-relaxed text-[15px]">
            {data.profile.split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="bg-[#0a0212]/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(34,211,238,0.1)] h-full pointer-events-auto">
          <h3 className="text-2xl font-bold text-cyan-400 mb-6 font-sans">Highlights</h3>
          <ul className="space-y-4 text-zinc-300 font-mono text-xs">
            {data.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3 leading-snug">
                <span className="text-cyan-500 mt-0.5 animate-pulse shrink-0">›</span> 
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
  return (
    <section id="projects" className="py-24 relative z-30 pointer-events-none">
      <div className="container mx-auto px-6 pointer-events-auto">
        <div className="mb-12 pointer-events-none">
          <span className="text-purple-500 font-mono text-sm tracking-widest uppercase mb-2 block">My Work</span>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mt-2">Projects</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5, boxShadow: "0 0 30px rgba(168,85,247,0.3)" }} 
              className="bg-[#0a0212]/80 backdrop-blur-md border border-purple-500/20 hover:border-purple-500/50 rounded-xl p-6 flex flex-col transition-all overflow-hidden group cursor-crosshair pointer-events-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{p.icon || '🚀'}</span>
                  <h3 className="text-xl font-bold text-purple-300">{p.title}</h3>
                </div>
                {p.badge && <span className="text-[10px] font-mono bg-purple-900/40 text-purple-400 px-2 py-1 rounded border border-purple-500/30 whitespace-nowrap">{p.badge}</span>}
              </div>
              <p className="text-zinc-400 text-sm mb-6 flex-1">{p.description || p.desc}</p>
              {p.tech && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.tech.map(t => <span key={t} className="text-[10px] font-mono text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded-full border border-cyan-500/20">{t}</span>)}
                </div>
              )}
              <div className="flex gap-4 text-sm font-mono font-bold mt-auto border-t border-purple-500/20 pt-4">
                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-cyan-400 transition-colors">Live ↗</a>}
                {p.codeUrl && <a href={p.codeUrl} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-cyan-400 transition-colors">Code ↗</a>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SkillsSection = ({ skills }) => (
  <section id="skills" className="py-24 relative z-30 pointer-events-auto">
    <div className="container mx-auto px-6">
      <div className="mb-12 pointer-events-none">
        <span className="text-cyan-500 font-mono text-sm tracking-widest uppercase block mb-2">Toolkit</span>
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mt-2">Skills & Certifications</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-[#0a0212]/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
          <h3 className="text-2xl font-bold text-cyan-400 mb-6 font-sans">Technical Expertise</h3>
          <div className="flex flex-wrap gap-3">
            {skills.technical.map((s, i) => (
              <div key={i} className="flex items-center gap-2 bg-cyan-900/20 border border-cyan-500/30 px-3 py-2 rounded-full text-sm text-zinc-300 font-mono">
                {s}
              </div>
            ))}
          </div>
          <h3 className="text-2xl font-bold text-cyan-400 mb-6 mt-10 font-sans">Soft Skills & Tools</h3>
          <div className="flex flex-wrap gap-3">
            {skills.soft.map((s, i) => (
              <div key={i} className="bg-purple-900/20 border border-purple-500/30 px-3 py-1.5 rounded-full text-sm text-purple-300">{s}</div>
            ))}
          </div>
        </div>
        <div className="bg-[#0a0212]/80 backdrop-blur-md border border-purple-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
          <h3 className="text-2xl font-bold text-purple-400 mb-6 font-sans">Recent Certifications</h3>
          <div className="space-y-4">
            <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl flex justify-between items-center transition-colors">
              <div>
                <h4 className="font-bold text-zinc-200">Oracle Cloud Infrastructure</h4>
                <p className="text-xs text-zinc-400 font-mono mt-1">Foundations Associate</p>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Oct 2025</span>
            </div>
            <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl flex justify-between items-center transition-colors">
              <div>
                <h4 className="font-bold text-zinc-200">Postman API Fundamental Student Expert</h4>
                <p className="text-xs text-zinc-400 font-mono mt-1">Postman</p>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Sep 2025</span>
            </div>
            <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl flex justify-between items-center transition-colors">
              <div>
                <h4 className="font-bold text-zinc-200">Front End Development Libraries</h4>
                <p className="text-xs text-zinc-400 font-mono mt-1">freeCodeCamp</p>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Sep 2025</span>
            </div>
            <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl flex justify-between items-center transition-colors">
              <div>
                <h4 className="font-bold text-zinc-200">Responsive Web Design</h4>
                <p className="text-xs text-zinc-400 font-mono mt-1">freeCodeCamp</p>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Jan 2025</span>
            </div>
          </div>
          <details className="mt-6 group border border-purple-500/20 rounded-lg overflow-hidden pointer-events-auto">
            <summary className="p-4 bg-purple-900/10 cursor-pointer font-bold text-purple-400 flex justify-between items-center outline-none">
              Additional & Earlier Certifications
              <span className="text-xs opacity-50 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 space-y-3 bg-black/30 border-t border-purple-500/20">
              <div className="text-sm"><span className="text-zinc-300">Basic Course — AutoCAD & 3Ds Max</span> <span className="text-zinc-500 text-xs ml-2">Wijeya Graphics · Sep 2019</span></div>
              <div className="text-sm"><span className="text-zinc-300">Certificate in Web Development</span> <span className="text-zinc-500 text-xs ml-2">NAC · Sep 2015</span></div>
              <div className="text-sm"><span className="text-zinc-300">Certificate in 3D Max</span> <span className="text-zinc-500 text-xs ml-2">NAC · Feb 2014</span></div>
              <div className="text-sm"><span className="text-zinc-300">Certificate in Computer Graphics</span> <span className="text-zinc-500 text-xs ml-2">NAC · Feb 2013</span></div>
              <div className="text-sm"><span className="text-zinc-300">Certificate in Computer Studies</span> <span className="text-zinc-500 text-xs ml-2">NAC · Jul 2012</span></div>
            </div>
          </details>
        </div>
      </div>
    </div>
  </section>
);

const ContactSection = ({ email, linkedin, github }) => {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    alert('Email copied to clipboard!');
  };

  return (
    <section id="contact" className="py-24 relative z-30 pointer-events-none">
      <div className="container mx-auto px-6">
        <div className="mb-12 pointer-events-none">
          <span className="text-purple-500 font-mono text-sm tracking-widest uppercase mb-2 block">Let's Talk</span>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mt-2">Contact</h2>
          <p className="text-zinc-400 mt-4 max-w-2xl">Have a project in mind or just want to say hi? I'd love to hear from you.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#0a0212]/80 backdrop-blur-md border border-purple-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(168,85,247,0.1)] pointer-events-auto">
            <h3 className="text-2xl font-bold text-zinc-100 mb-6">Send a Message</h3>
            <form action={`mailto:${email}`} method="GET" className="space-y-4">
              <div>
                <label className="block text-sm text-purple-400 mb-1">Name / Subject</label>
                <input name="subject" placeholder="Your name / subject" required className="w-full bg-black/50 border border-purple-500/30 rounded p-3 text-zinc-100 outline-none focus:border-cyan-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-purple-400 mb-1">Message</label>
                <textarea name="body" rows="5" placeholder="What would you like to talk about?" required className="w-full bg-black/50 border border-purple-500/30 rounded p-3 text-zinc-100 outline-none focus:border-cyan-500 transition-colors"></textarea>
              </div>
              <button type="submit" className="w-full bg-purple-600 rounded font-bold py-3 text-lg hover:bg-purple-500 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                Send Message →
              </button>
              <p className="text-xs text-zinc-500 text-center mt-2">This form will open your email app.</p>
            </form>
          </div>
          
          <div className="bg-[#0a0212]/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(34,211,238,0.1)] pointer-events-auto h-fit">
            <h3 className="text-2xl font-bold text-zinc-100 mb-6">Reach Me Directly</h3>
            <ul className="space-y-6">
              <li className="flex items-center gap-4">
                <span className="text-2xl">✉</span>
                <div className="flex-1">
                  <a href={`mailto:${email}`} className="text-cyan-400 hover:text-cyan-300 hover:underline">{email}</a>
                </div>
                <button onClick={handleCopyEmail} className="p-2 bg-purple-900/30 border border-purple-500/30 rounded hover:bg-purple-900/60 transition-colors" title="Copy Email">
                  📋
                </button>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-2xl">⎔</span>
                <a href={github} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 hover:underline">github.com/BuddhikaBICT-UoR-FoT-6</a>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-2xl">💼</span>
                <a href={linkedin} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 hover:underline">linkedin.com/in/buddhika-darshan</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [portfolioData, setPortfolioData] = useState(DEFAULT_PORTFOLIO_DATA);
  const [profilePhoto, setProfilePhoto] = useState('/profile.png');
  const [resumeData, setResumeData] = useState(null);
  const [resumeName, setResumeName] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [bootPlayed, setBootPlayed] = useState(false);
  
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    // Force clear localStorage once to ensure the restored About content applies
    if (!sessionStorage.getItem('dataCleared')) {
      localStorage.removeItem('portfolioData');
      sessionStorage.setItem('dataCleared', 'true');
    }

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

  // Initialize Canvas Renderer
  useEffect(() => {
    if (bootPlayed && canvasRef.current && !rendererRef.current) {
      rendererRef.current = new CircuitRenderer(canvasRef.current);
      rendererRef.current.start();
    }
    return () => {
      if (rendererRef.current) {
        rendererRef.current.stop();
        rendererRef.current = null;
      }
    };
  }, [bootPlayed]);

  if (!bootPlayed) {
    return <BootSequence onComplete={() => setBootPlayed(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-[#050d0a] font-sans text-zinc-100 overflow-x-hidden selection:bg-purple-500/30">
      
      {/* CANVAS ENGINE LAYER */}
      <canvas 
        id="circuitCanvas"
        ref={canvasRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      />
      
      {/* UI CONTENT WRAPPER */}
      {/* pointer-events-none lets mouse events hit the canvas. Individual elements override to pointer-events-auto */}
      <div className="relative z-10 pointer-events-none container mx-auto px-6 py-4 flex flex-col min-h-screen">
        <NavBar fullName={portfolioData.personal.fullName} />

        {/* HERO SECTION */}
        <div className="flex-1 grid lg:grid-cols-2 gap-12 items-center pt-32 pb-24 pointer-events-none">
          <div className="space-y-8">
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
              <span className="text-cyan-500 font-mono text-sm tracking-widest uppercase mb-4 block">
                {portfolioData.personal.title}
              </span>
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
                {portfolioData.personal.heroTitle}
              </h1>
              <p className="text-xl text-zinc-400 max-w-lg leading-relaxed pointer-events-auto">
                I'm a <Typewriter strings={['React Developer', 'IoT Engineer', 'Full-Stack Developer', 'Tech Enthusiast']} />
                <br /><br />
                {portfolioData.personal.heroSubtitle}
              </p>
            </motion.div>
            <div className="flex gap-4 pointer-events-none">
              <motion.button 
                onClick={(e) => {
                  e.stopPropagation();
                  rendererRef.current?.onClick(e.clientX, e.clientY);
                  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(168,85,247,0.5)" }} 
                whileTap={{ scale: 0.98 }} 
                className="px-8 py-4 bg-purple-600 rounded-full font-bold text-lg shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all pointer-events-auto"
              >
                View Projects →
              </motion.button>
              {resumeData && (
                <motion.a 
                  href={resumeData} 
                  download={resumeName}
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ background: "rgba(34,211,238,0.1)", borderColor: "rgba(34,211,238,0.5)" }} 
                  className="inline-flex items-center px-8 py-4 border border-cyan-500/30 text-cyan-400 rounded-full font-bold transition-colors pointer-events-auto"
                >
                  ↓ Download CV
                </motion.a>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-12 lg:items-end pointer-events-none">
            <SystemCore />
            <HoverModule />
          </div>
        </div>

        <AboutSection data={portfolioData.about} profilePhoto={profilePhoto} />
        <ProjectsSection projects={portfolioData.projects} />
        <SkillsSection skills={portfolioData.skills} />
        <ContactSection email={portfolioData.personal.email} linkedin={portfolioData.personal.linkedin} github={portfolioData.personal.github} />

        <footer className="mt-auto pt-12 flex justify-between items-center text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase bg-[#0a0212]/80 p-4 rounded-t-xl border-t border-purple-500/30 pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]" />
            System Operational
          </div>
          <div>© {new Date().getFullYear()} {portfolioData.personal.fullName}. All Rights Reserved.</div>
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
