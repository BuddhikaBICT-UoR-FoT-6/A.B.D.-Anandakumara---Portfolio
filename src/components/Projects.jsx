import { usePortfolioData } from '../hooks/usePortfolioData';

const ProjectCard = ({ project }) => {
  const isComplete = project.status !== 'active'; // Admin data doesn't have status, default to complete unless specified

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

      <div className="flex justify-between items-start mb-6 border-b border-[var(--pcb-green-light)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`led-dot ${isComplete ? 'text-[var(--terminal-green)]' : 'text-[var(--terminal-yellow)]'}`} />
            <h3 className="text-xl font-mono text-white">{project.title}</h3>
          </div>
          <span className="text-[10px] font-mono text-[var(--pcb-green-light)]">{project.badge}</span>
        </div>
      </div>

      <p className="text-xs opacity-70 mb-6 h-10 line-clamp-2">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.tech.map(t => (
          <span key={t} className="text-[10px] font-mono border border-[var(--pcb-green-light)] px-2 py-0.5 opacity-60">
            {t}
          </span>
        ))}
      </div>

      <div className="flex gap-4 border-t border-[var(--pcb-green-light)] pt-4">
        {project.codeUrl && (
          <a href={project.codeUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-[var(--terminal-green)] hover:underline">
            → GITHUB
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-[var(--terminal-yellow)] hover:underline">
            ⬡ LIVE_DEMO
          </a>
        )}
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const { projects } = usePortfolioData();
  
  return (
    <section id="projects" className="content-section py-32 px-8 max-w-7xl mx-auto relative z-10">
      <div className="section-header flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-mono text-[var(--terminal-green)]">
          // SECTION_02 :: MODULE_REGISTRY
        </h2>
        <div className="flex-1 h-[1px] bg-[var(--pcb-green-light)] opacity-30" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p, i) => (
          <ProjectCard key={i} project={p} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
