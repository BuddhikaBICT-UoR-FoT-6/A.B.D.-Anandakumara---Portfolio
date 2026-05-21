import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';

const SKILLS = [
  { component: 'Spring Boot / Java', spec: 'Backend Core', status: 'ACTIVE', level: 88 },
  { component: 'React / Flutter', spec: 'Frontend/Mobile', status: 'ACTIVE', level: 87 },
  { component: 'Node.js / Express', spec: 'Runtime/Web', status: 'ACTIVE', level: 88 },
  { component: 'JavaScript / TypeScript', spec: 'Logic Layer', status: 'ACTIVE', level: 90 },
  { component: 'Kotlin / Android', spec: 'Mobile Native', status: 'ACTIVE', level: 80 },
  { component: 'MongoDB / MySQL', spec: 'Persistence', status: 'ACTIVE', level: 83 }
];

const CERTS = [
  { 
    name: 'Back End Development & APIs', 
    issuer: 'freeCodeCamp', 
    date: 'Oct 2025', 
    verifyLink: 'https://www.freecodecamp.org/certification/buddhikadarshan/back-end-development-and-apis' 
  },
  { 
    name: 'OCI Foundations Associate', 
    issuer: 'Oracle', 
    date: 'Sep 2025' 
  },
  { 
    name: 'Front End Development Libraries', 
    issuer: 'freeCodeCamp', 
    date: 'Sep 2025', 
    verifyLink: 'https://www.freecodecamp.org/certification/buddhikadarshan/front-end-development-libraries' 
  },
  { 
    name: 'Responsive Web Design', 
    issuer: 'freeCodeCamp', 
    date: 'Jan 2025', 
    verifyLink: 'https://www.freecodecamp.org/certification/buddhikadarshan/responsive-web-design' 
  },
  { name: 'AutoCAD & 3Ds Max', issuer: 'Wijeya Graphics', date: 'Sep 2019' },
  { name: 'Web Development', issuer: 'NAC Computer System', date: 'Sep 2015' },
  { name: '3D Max', issuer: 'NAC Computer System', date: 'Feb 2014' },
  { name: 'Computer Graphics', issuer: 'NAC Computer System', date: 'Feb 2013' },
  { name: 'Computer Studies', issuer: 'NAC Computer System', date: 'Jul 2012' }
];

const SOFT_SKILLS = [
  { tag: 'Git & GitHub', emoji: '🔧' },
  { tag: 'Jest Testing', emoji: '🧪' },
  { tag: 'REST API Design', emoji: '📦' },
  { tag: 'UI/UX Thinking', emoji: '🎨' },
  { tag: 'Teamwork', emoji: '🤝' },
  { tag: 'Problem Solving', emoji: '🧩' },
  { tag: 'Communication', emoji: '📢' },
  { tag: 'Redis Caching', emoji: '⚡' },
  { tag: 'Cryptography', emoji: '🔐' },
  { tag: 'PDF Generation', emoji: '📄' }
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

const Skills = () => {
  const { skills } = usePortfolioData();

  const displaySkills = (skills && Array.isArray(skills.technical) && skills.technical.length > 0)
    ? skills.technical.map(skillName => {
        const matched = SKILLS.find(s => s.component.toLowerCase() === skillName.toLowerCase());
        return {
          component: skillName,
          spec: matched ? matched.spec : 'Logic/Data',
          status: matched ? matched.status : 'ACTIVE',
          level: matched ? matched.level : 80
        };
      })
    : SKILLS;

  const displaySoftSkills = (skills && Array.isArray(skills.soft) && skills.soft.length > 0)
    ? skills.soft.map(skillName => {
        const matched = SOFT_SKILLS.find(s => s.tag.toLowerCase() === skillName.toLowerCase());
        return {
          tag: skillName,
          emoji: matched ? matched.emoji : '⚡'
        };
      })
    : SOFT_SKILLS;

  return (
    <section id="skills" className="content-section py-32 px-8 max-w-6xl mx-auto relative z-10">
      <div className="section-header flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-mono text-[var(--terminal-green)]">
          // TECH_STACK :: CORE_COMPETENCIES
        </h2>
        <div className="flex-1 h-[1px] bg-[var(--pcb-green-light)] opacity-30" />
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Left Column: Tech Specs + Soft Skills */}
        <div className="space-y-12">
          <div className="pcb-card h-fit">
            <h3 className="text-sm font-mono text-[var(--pcb-green-light)] mb-6 uppercase tracking-widest">
              TECHNICAL_SPECIFICATIONS
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
                    <tr key={i} className="group">
                      <td className="py-3 text-[var(--terminal-green)]">{skill.component}</td>
                      <td className="py-3 opacity-60">{skill.spec}</td>
                      <td className="py-3 text-[var(--terminal-yellow)]">{skill.status}</td>
                      <td className="py-3"><SkillBar level={skill.level} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-mono text-[var(--pcb-green-light)] mb-6 uppercase tracking-widest">
              PIN_HEADER_PROTOCOLS
            </h3>
            <div className="flex flex-wrap gap-3">
              {displaySoftSkills.map(item => (
                <div key={item.tag} className="bg-[#111] border border-[var(--pcb-green-light)] px-3 py-1.5 font-mono text-[10px] text-[var(--terminal-green)] shadow-[4px_4px_0_var(--pcb-green-dark)] hover:text-white hover:border-[var(--terminal-green)] transition-all duration-300 cursor-default flex items-center gap-2 group hover:-translate-y-1">
                  <span className="opacity-70 group-hover:scale-125 transition-transform">{item.emoji}</span>
                  {item.tag.toUpperCase().replace(/ /g, '_')}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Certifications */}
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-mono text-[var(--pcb-green-light)] mb-6 uppercase tracking-widest">
              CERTIFICATIONS_REGISTRY
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
                      <div className="text-[8px] font-mono opacity-40">REG: {String(i+1).padStart(3, '0')}</div>
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
