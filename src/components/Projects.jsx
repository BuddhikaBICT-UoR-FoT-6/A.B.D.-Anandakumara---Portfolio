import React from 'react';
import { motion } from 'framer-motion';

const PROJECTS = [
  {
    name: 'HomeCanvas',
    category: 'IoT_CONTROL_v1',
    description: 'IoT home automation system with ESP32, React, and Spring Boot. Real-time sensor dashboard.',
    tags: ['React', 'ESP32', 'MQTT'],
    status: 'complete',
    github: '#'
  },
  {
    name: 'CrowdFlow',
    category: 'ML_ANALYTICS_v2',
    description: 'Computer vision powered crowd analytics using Node.js and React.',
    tags: ['ML', 'Node.js', 'React'],
    status: 'complete',
    github: '#'
  },
  {
    name: 'BoutiqueFlow',
    category: 'E-COMM_CORE',
    description: 'Full-stack e-commerce platform with Spring Boot and Stripe/PayPal integration.',
    tags: ['Spring Boot', 'Stripe', 'React'],
    status: 'complete',
    github: '#'
  },
  {
    name: 'Cypher-UI',
    category: 'LIB_COMPONENT',
    description: 'A premium React component library built with Tailwind CSS.',
    tags: ['React', 'Tailwind', 'Framework'],
    status: 'active',
    github: '#'
  },
  {
    name: 'Smart Campus',
    category: 'IoT_INFRA_v3',
    description: 'Comprehensive campus management with ESP32 and MQTT protocols.',
    tags: ['ESP32', 'MQTT', 'Spring Boot'],
    status: 'complete',
    github: '#'
  },
  {
    name: 'Secure Vault',
    category: 'SEC_UTIL',
    description: 'Desktop security tool for encrypted environment variable management.',
    tags: ['Java', 'Security', 'Desktop'],
    status: 'complete',
    github: '#'
  }
];

const ProjectCard = ({ project }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="pcb-card group cursor-pointer border-[var(--pcb-green-light)]"
    >
      {/* Corner Mounting Holes */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full border border-[var(--pcb-green-light)]" />
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-[var(--pcb-green-light)]" />
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full border border-[var(--pcb-green-light)]" />
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full border border-[var(--pcb-green-light)]" />

      {/* Trace Border Animation */}
      <div className="pcb-trace-border group-hover:border-[var(--active-gold)] group-hover:opacity-100 transition-all duration-500" />

      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-mono text-[var(--terminal-green)] group-hover:text-white transition-colors">
            {project.name}
          </h3>
          <span className="bg-[var(--pcb-green)] text-[8px] font-mono px-1.5 py-0.5 rounded border border-[var(--pcb-green-light)]">
            {project.category}
          </span>
        </div>
        <div className={`led-indicator ${project.status === 'complete' ? 'bg-[var(--terminal-green)]' : 'bg-[var(--terminal-yellow)]'} animate-pulse`} />
      </div>

      <p className="text-xs opacity-70 mb-6 h-10 line-clamp-2">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.tags.map(tag => (
          <span key={tag} className="text-[10px] font-mono border border-[var(--pcb-green-light)] px-2 py-0.5 opacity-60">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-4 border-t border-[var(--pcb-green-light)] pt-4">
        <a href={project.github} className="text-[10px] font-mono text-[var(--terminal-green)] hover:underline">
          → GITHUB
        </a>
        <a href="#" className="text-[10px] font-mono text-[var(--terminal-yellow)] hover:underline">
          ⬡ LIVE_DEMO
        </a>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-32 px-8 max-w-7xl mx-auto relative z-10">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-mono text-[var(--terminal-green)]">
          // SECTION_02 :: MODULE_REGISTRY
        </h2>
        <div className="flex-1 h-[1px] bg-[var(--pcb-green-light)] opacity-30" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={i} project={p} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
