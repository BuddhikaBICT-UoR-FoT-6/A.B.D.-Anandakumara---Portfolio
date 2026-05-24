import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';

// ── Skill → project insight mapping ─────────────────────────────────────────
const SKILL_INSIGHTS = {
  'Spring Boot / Java': {
    project: 'HomeCanvas',
    detail: 'Built the entire REST backend with Spring Boot — RESTful endpoints, JWT auth, and ESP32 sensor data ingestion via scheduled polling.',
  },
  'React / Flutter': {
    project: 'Smart Campus',
    detail: 'Architected a multi-role Flutter app with Clean Architecture and Provider state management, plus offline-first sync using SQLite.',
  },
  'Node.js / Express': {
    project: 'BoutiqueFlow',
    detail: 'Developed the full Express API layer — RBAC middleware, Stripe/PayPal webhooks, and real-time inventory updates over REST.',
  },
  'JavaScript / TypeScript': {
    project: 'Cypher-UI',
    detail: 'Wrote all encryption visualiser logic and brute-force simulators in TypeScript, with 95%+ Jest coverage across the engine.',
  },
  'Kotlin / Android': {
    project: 'CrowdFlow',
    detail: 'Built the native Android client in Kotlin — Google Maps SDK integration, real-time severity feedback, and offline caching.',
  },
  'MongoDB / MySQL / SQLite': {
    project: 'BoutiqueFlow & Smart Campus',
    detail: 'Used MongoDB for flexible product/order documents in BoutiqueFlow, and SQLite for offline-first data sync in Smart Campus.',
  },
  'Cloud (GCP / OCI)': {
    project: 'HomeCanvas',
    detail: 'Deployed the Spring Boot service on GCP Cloud Run behind a managed load balancer, with OCI Object Storage for sensor logs.',
  },
  'Docker / CI-CD': {
    project: 'HomeCanvas',
    detail: 'Containerised the backend with Docker, wired GitHub Actions to build & push images, then deploy to Cloud Run on every merge.',
  },
  // Soft / other skills
  'Git & GitHub': {
    project: 'All Projects',
    detail: 'Maintained feature-branch workflows with PR reviews across every project — enforcing conventional commits and protected main branches.',
  },
  'Communication': {
    project: 'Smart Campus',
    detail: 'Coordinated sprint planning and daily stand-ups for the Smart Campus team, translating stakeholder requirements into user stories.',
  },
  'Problem-solving': {
    project: 'CrowdFlow',
    detail: 'Designed a Redis-backed debounce layer to handle burst traffic spikes in CrowdFlow, cutting dropped updates by 80%.',
  },
  'REST API Design': {
    project: 'BoutiqueFlow',
    detail: 'Designed a fully RESTful API with versioned routes, OpenAPI docs, and hypermedia links across the BoutiqueFlow backend.',
  },
  'Jest Testing': {
    project: 'Cypher-UI',
    detail: 'Achieved 95%+ statement coverage on the Cypher-UI encryption engine using Jest unit and integration tests with mocked crypto APIs.',
  },
  'Redis Caching': {
    project: 'CrowdFlow',
    detail: 'Added a Redis cache layer in CrowdFlow to store recent traffic severity scores, cutting DB reads by 70% under peak load.',
  },
  'Cryptography': {
    project: 'Cypher-UI & Secure Vault',
    detail: 'Implemented AES, RSA and Caesar visualisers in Cypher-UI; used AES-256 encryption for .env backup files in Secure Vault.',
  },
  'Teamwork': {
    project: 'Smart Campus',
    detail: 'Collaborated with a 4-person team on Smart Campus, splitting Flutter modules by feature and merging weekly via GitHub PRs.',
  },
};

// Fallback for dynamic skills not in the map
function getInsight(name) {
  // Fuzzy match — check if any key is a substring
  const key = Object.keys(SKILL_INSIGHTS).find(
    k => k.toLowerCase().includes(name.toLowerCase()) ||
         name.toLowerCase().includes(k.toLowerCase())
  );
  return key ? SKILL_INSIGHTS[key] : {
    project: 'Multiple Projects',
    detail: `Applied ${name} across several projects to build scalable, maintainable features.`,
  };
}

// ── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(fullText, active, durationMs = 2000) {
  const [displayed, setDisplayed] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setDisplayed('');
      clearInterval(timerRef.current);
      return;
    }
    setDisplayed('');
    const totalChars = fullText.length;
    const intervalMs = durationMs / totalChars;
    let idx = 0;
    timerRef.current = setInterval(() => {
      idx++;
      setDisplayed(fullText.slice(0, idx));
      if (idx >= totalChars) clearInterval(timerRef.current);
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [active, fullText, durationMs]);

  return displayed;
}

// ── Tooltip popup ────────────────────────────────────────────────────────────
function SkillTooltip({ name, visible }) {
  const insight = getInsight(name);
  const fullText = `[${insight.project}] — ${insight.detail}`;
  const text = useTypewriter(fullText, visible, 2000);

  if (!visible) return null;

  return (
    <div
      className="absolute z-50 left-0 top-full mt-2 w-80 pointer-events-none"
      style={{ filter: 'drop-shadow(0 0 12px rgba(0,180,255,0.4))' }}
    >
      <div
        className="border border-[#00b4ff]/40 bg-[#000d1a]/95 backdrop-blur-sm px-3 py-2 font-mono text-[11px] leading-relaxed"
        style={{ borderRadius: '2px' }}
      >
        <div className="text-[#00b4ff]/60 text-[9px] mb-1 uppercase tracking-widest">
          Used in ▸
        </div>
        <span style={{ color: '#7dd3fc' }}>
          {text}
        </span>
        <span className="inline-block w-[6px] h-[12px] bg-[#7dd3fc] ml-0.5 align-middle animate-pulse" />
      </div>
    </div>
  );
}

// ── Existing helpers ─────────────────────────────────────────────────────────
const SKILLS = [
  { component: 'Spring Boot / Java',       spec: 'Backend Core',    status: 'ACTIVE', level: 88 },
  { component: 'React / Flutter',          spec: 'Frontend/Mobile', status: 'ACTIVE', level: 87 },
  { component: 'Node.js / Express',        spec: 'Runtime/Web',     status: 'ACTIVE', level: 88 },
  { component: 'JavaScript / TypeScript',  spec: 'Logic Layer',     status: 'ACTIVE', level: 90 },
  { component: 'Kotlin / Android',         spec: 'Mobile Native',   status: 'ACTIVE', level: 80 },
  { component: 'MongoDB / MySQL / SQLite', spec: 'Persistence',     status: 'ACTIVE', level: 83 },
];

const CERTS = [
  { name: 'Back End Development & APIs', issuer: 'freeCodeCamp', date: 'Oct 2025', verifyLink: 'https://www.freecodecamp.org/certification/buddhikadarshan/back-end-development-and-apis' },
  { name: 'OCI Foundations Associate',   issuer: 'Oracle',        date: 'Sep 2025' },
  { name: 'Front End Development Libraries', issuer: 'freeCodeCamp', date: 'Sep 2025', verifyLink: 'https://www.freecodecamp.org/certification/buddhikadarshan/front-end-development-libraries' },
  { name: 'Responsive Web Design',       issuer: 'freeCodeCamp', date: 'Jan 2025', verifyLink: 'https://www.freecodecamp.org/certification/buddhikadarshan/responsive-web-design' },
  { name: 'AutoCAD & 3Ds Max',           issuer: 'Wijeya Graphics',     date: 'Sep 2019' },
  { name: 'Web Development',             issuer: 'NAC Computer System', date: 'Sep 2015' },
  { name: '3D Max',                      issuer: 'NAC Computer System', date: 'Feb 2014' },
  { name: 'Computer Graphics',           issuer: 'NAC Computer System', date: 'Feb 2013' },
  { name: 'Computer Studies',            issuer: 'NAC Computer System', date: 'Jul 2012' },
];

const SOFT_SKILLS = [
  { tag: 'Git & GitHub',    emoji: '🔧' },
  { tag: 'Jest Testing',    emoji: '🧪' },
  { tag: 'REST API Design', emoji: '📦' },
  { tag: 'Teamwork',        emoji: '🤝' },
  { tag: 'Problem-solving', emoji: '🧩' },
  { tag: 'Communication',   emoji: '📢' },
  { tag: 'Redis Caching',   emoji: '⚡' },
  { tag: 'Cryptography',    emoji: '🔐' },
];

const SkillBar = ({ level }) => (
  <div className="flex items-center gap-1 font-mono text-[10px]">
    <span className="text-[var(--terminal-green)] liquid-animate">
      {'█'.repeat(Math.floor(level / 10))}
      <span className="opacity-20">{'░'.repeat(10 - Math.floor(level / 10))}</span>
    </span>
    <span className="ml-2 percentage-glow">{level}%</span>
  </div>
);

// ── Main component ───────────────────────────────────────────────────────────
const Skills = () => {
  const { skills } = usePortfolioData();
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const displaySkills = (skills && Array.isArray(skills.technical) && skills.technical.length > 0)
    ? skills.technical.map(skillName => {
        const matched = SKILLS.find(s => s.component.toLowerCase() === skillName.toLowerCase());
        return {
          component: skillName,
          spec:   matched ? matched.spec   : 'Logic/Data',
          status: matched ? matched.status : 'ACTIVE',
          level:  matched ? matched.level  : 80,
        };
      })
    : SKILLS;

  const displaySoftSkills = (skills && Array.isArray(skills.soft) && skills.soft.length > 0)
    ? skills.soft.map(skillName => {
        const matched = SOFT_SKILLS.find(s => s.tag.toLowerCase() === skillName.toLowerCase());
        return { tag: skillName, emoji: matched ? matched.emoji : '⚡' };
      })
    : SOFT_SKILLS;

  return (
    <section id="skills" className="content-section py-32 px-8 max-w-6xl mx-auto relative z-10">
      <div className="section-header flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-mono text-[var(--terminal-green)]">Skills</h2>
        <div className="flex-1 h-[1px] bg-[var(--pcb-green-light)] opacity-30" />
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Left Column */}
        <div className="space-y-12">

          {/* Technical Skills Table */}
          <div className="pcb-card h-fit">
            <h3 className="text-sm font-mono text-[var(--pcb-green-light)] mb-6 uppercase tracking-widest">
              Technical Skills
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-[10px] text-left">
                <thead className="border-b border-[var(--pcb-green-light)]">
                  <tr>
                    <th className="pb-2 text-[var(--pcb-green-light)]">COMPONENT</th>
                    <th className="pb-2 text-[var(--pcb-green-light)]">SPEC</th>
                    <th className="pb-2 text-[var(--pcb-green-light)]">STATUS</th>
                    <th className="pb-2 text-[var(--pcb-green-light)]">PROFICIENCY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--pcb-green-light)]/20">
                  {displaySkills.map((skill, i) => (
                    <tr
                      key={i}
                      className="group relative cursor-default"
                      onMouseEnter={() => setHoveredSkill(`tech-${i}`)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <td className="py-3 text-[var(--terminal-green)] relative">
                        <span className="group-hover:text-[#7dd3fc] transition-colors duration-200">
                          {skill.component}
                        </span>
                        <SkillTooltip
                          name={skill.component}
                          visible={hoveredSkill === `tech-${i}`}
                        />
                      </td>
                      <td className="py-3 opacity-60 group-hover:opacity-100 transition-opacity">{skill.spec}</td>
                      <td className="py-3 text-[var(--terminal-yellow)]">{skill.status}</td>
                      <td className="py-3"><SkillBar level={skill.level} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Other Skills (soft) */}
          <div>
            <h3 className="text-sm font-mono text-[var(--pcb-green-light)] mb-6 uppercase tracking-widest">
              Other Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {displaySoftSkills.map((item, i) => (
                <div
                  key={item.tag}
                  className="relative bg-[#111] border border-[var(--pcb-green-light)] px-3 py-1.5 font-mono text-[10px] text-[var(--terminal-green)] shadow-[4px_4px_0_var(--pcb-green-dark)] hover:border-[#7dd3fc] hover:text-[#7dd3fc] transition-all duration-300 cursor-default flex items-center gap-2 group hover:-translate-y-1"
                  onMouseEnter={() => setHoveredSkill(`soft-${i}`)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <span className="opacity-70 group-hover:scale-125 transition-transform">{item.emoji}</span>
                  {item.tag.toUpperCase().replace(/ /g, '_').replace(/-/g, '-')}
                  <SkillTooltip
                    name={item.tag}
                    visible={hoveredSkill === `soft-${i}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Certifications */}
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-mono text-[var(--pcb-green-light)] mb-6 uppercase tracking-widest">
              Certifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr">
              {CERTS.map((cert, i) => (
                <div key={i} className="pcb-card p-4 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-6 h-6 bg-[var(--pcb-green-light)] opacity-20 grid grid-cols-4 grid-rows-4 gap-0.5">
                        {Array.from({ length: 16 }).map((_, j) => (
                          <div key={j} className={Math.random() > 0.5 ? 'bg-[var(--terminal-green)]' : ''} />
                        ))}
                      </div>
                      <div className="text-[8px] font-mono opacity-40">REG: {String(i + 1).padStart(3, '0')}</div>
                    </div>
                    <div className="text-[10px] font-mono text-[var(--terminal-green)] leading-tight mb-1">{cert.name}</div>
                    <div className="text-[8px] font-mono opacity-60">{cert.issuer} // {cert.date}</div>
                  </div>
                  {cert.verifyLink && (
                    <a
                      href={cert.verifyLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 text-[9px] font-mono text-[var(--terminal-yellow)] hover:underline flex items-center gap-1"
                    >
                      → VERIFY_CREDENTIAL
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
