import React from 'react';
import { motion } from 'framer-motion';

const SKILLS = [
  { component: 'React 18', spec: 'v18.2.0', status: 'ACTIVE', level: 82 },
  { component: 'Spring Boot', spec: 'v3.2.0', status: 'ACTIVE', level: 74 },
  { component: 'Arduino/ESP32', spec: 'C++ Embedded', status: 'ACTIVE', level: 80 },
  { component: 'Java 21', spec: 'Production', status: 'ACTIVE', level: 84 },
  { component: 'PostgreSQL', spec: 'Relational', status: 'ACTIVE', level: 78 },
  { component: 'Docker', spec: 'Containerized', status: 'ACTIVE', level: 70 }
];

const CERTS = [
  { name: 'Oracle Certified Associate', issuer: 'Oracle', date: '2023' },
  { name: 'Full Stack Development', issuer: 'University', date: '2024' }
];

const SkillBar = ({ level }) => (
  <div className="flex items-center gap-1 font-mono text-[10px]">
    <span className="text-[var(--terminal-green)]">
      {'█'.repeat(Math.floor(level / 10))}
      <span className="opacity-30">{'░'.repeat(10 - Math.floor(level / 10))}</span>
    </span>
    <span className="ml-2">{level}%</span>
  </div>
);

const Skills = () => {
  return (
    <section id="skills" className="py-32 px-8 max-w-6xl mx-auto relative z-10">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-mono text-[var(--terminal-green)]">
          // SECTION_03 :: COMPONENT_DATASHEET
        </h2>
        <div className="flex-1 h-[1px] bg-[var(--pcb-green-light)] opacity-30" />
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        <div className="pcb-card">
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
                {SKILLS.map((skill, i) => (
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

        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-mono text-[var(--pcb-green-light)] mb-6 uppercase tracking-widest">
              CERTIFICATIONS_REGISTRY
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {CERTS.map((cert, i) => (
                <div key={i} className="pcb-card p-4 group perspective-1000">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-[var(--pcb-green-light)] opacity-20 grid grid-cols-4 grid-rows-4 gap-0.5">
                      {Array.from({ length: 16 }).map((_, j) => (
                        <div key={j} className={Math.random() > 0.5 ? 'bg-[var(--terminal-green)]' : ''} />
                      ))}
                    </div>
                    <div className="text-[8px] font-mono opacity-40">REG_NO: 00{i+1}</div>
                  </div>
                  <div className="text-[10px] font-mono text-[var(--terminal-green)] mb-1">{cert.name}</div>
                  <div className="text-[8px] font-mono opacity-60">{cert.issuer} // {cert.date}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-mono text-[var(--pcb-green-light)] mb-6 uppercase tracking-widest">
              PIN_HEADER_PROTOCOLS
            </h3>
            <div className="flex flex-wrap gap-3">
              {['PROBLEM_SOLVING', 'RAPID_LEARNING', 'COLLAB_PROTOCOL', 'AGILE_METHOD', 'TECH_LEADERSHIP'].map(tag => (
                <div key={tag} className="bg-[#111] border border-[var(--pcb-green-light)] px-3 py-1.5 font-mono text-[10px] text-[var(--terminal-green)] shadow-[4px_4px_0_var(--pcb-green-dark)]">
                  {tag}
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
