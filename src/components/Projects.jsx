import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useMode } from '../context/ModeContext';

const ProjectCard = ({ project, isDev }) => {
  const isComplete = project.status !== 'active';

  if (!isDev) {
    // ── Recruiter Mode: clean card ─────────────────────────────
    return (
      <motion.div
        whileHover={{ y: -6 }}
        className="flex flex-col h-full rounded-xl border border-[rgba(0,255,65,0.2)] bg-[rgba(0,10,20,0.7)] backdrop-blur-sm p-5 transition-all duration-300 hover:border-[rgba(0,255,65,0.5)] hover:shadow-[0_0_20px_rgba(0,255,65,0.1)]"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isComplete ? 'bg-[#00FF41]' : 'bg-yellow-400 animate-pulse'}`} />
          <h3 className="text-base font-semibold text-white">{project.title}</h3>
        </div>
        {project.badge && (
          <span className="text-[10px] text-[#7dd3fc] mb-3">{project.badge}</span>
        )}
        <p className="text-sm text-[#a0bba0] leading-relaxed mb-4 flex-grow">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-[rgba(0,255,65,0.2)] text-[#c8e6c9] bg-[rgba(0,255,65,0.05)]">{t}</span>
          ))}
        </div>
        <div className="flex gap-4 pt-3 border-t border-[rgba(0,255,65,0.1)]">
          {project.codeUrl && (
            <a href={project.codeUrl} target="_blank" rel="noreferrer" className="text-xs text-[#00FF41] hover:underline">GitHub →</a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-xs text-[#7dd3fc] hover:underline">Live Demo →</a>
          )}
        </div>
      </motion.div>
    );
  }

  // ── Developer Mode: full terminal card ──────────────────────
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="pcb-card group cursor-pointer border-[var(--pcb-green-light)] flex flex-col h-full"
    >
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full border border-[var(--pcb-green-light)]" />
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-[var(--pcb-green-light)]" />
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full border border-[var(--pcb-green-light)]" />
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full border border-[var(--pcb-green-light)]" />
      <div className="pcb-trace-border group-hover:border-[var(--active-gold)] group-hover:opacity-100 transition-all duration-500" />
      <div className="flex justify-between items-start mb-6 border-b border-[var(--pcb-green-light)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`led-dot ${isComplete ? 'text-[var(--terminal-green)]' : 'text-[var(--terminal-yellow)]'}`} />
            <h3 className="text-xl font-mono text-white">{project.title}</h3>
          </div>
          <span className="text-[10px] font-mono text-[var(--pcb-green-light)]">{project.badge}</span>
        </div>
      </div>
      <p className="text-xs opacity-70 mb-6">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-8 flex-grow content-start">
        {project.tech.map(t => (
          <span key={t} className="text-[10px] font-mono border border-[var(--pcb-green-light)] px-2 py-0.5 opacity-60">{t}</span>
        ))}
      </div>
      <div className="flex gap-4 border-t border-[var(--pcb-green-light)] pt-4 mt-auto">
        {project.codeUrl && (
          <a href={project.codeUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-[var(--terminal-green)] hover:underline">→ GITHUB</a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-[var(--terminal-yellow)] hover:underline">⬡ LIVE_DEMO</a>
        )}
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const { projects } = usePortfolioData();
  const { mode } = useMode();
  const isDev = mode === 'developer';

  return (
    <section id="projects" className="content-section py-10 md:py-20 px-5 md:px-10 max-w-7xl mx-auto relative z-10">
      <div className="section-header flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-mono text-[var(--terminal-green)]">
          {isDev ? 'Projects' : 'Projects'}
        </h2>
        <div className="flex-1 h-[1px] bg-[var(--pcb-green-light)] opacity-30" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p, i) => (
          <ProjectCard key={i} project={p} isDev={isDev} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
