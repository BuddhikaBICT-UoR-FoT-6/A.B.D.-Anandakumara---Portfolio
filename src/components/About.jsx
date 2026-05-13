import { usePortfolioData } from '../hooks/usePortfolioData';

const DossierLine = ({ label, value }) => (
  <div className="flex gap-4 font-mono text-xs mb-2 group">
    <span className="text-[var(--pcb-green-light)]">{label.padEnd(16, '.')}</span>
    <span className="text-[var(--terminal-green)] group-hover:text-white transition-colors">{value}</span>
  </div>
);

const About = () => {
  const { about } = usePortfolioData();

  return (
    <section id="about" className="content-section py-32 px-8 max-w-6xl mx-auto relative z-10">
      <div className="section-header flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-mono text-[var(--terminal-green)]">
          // BIO_ENGINEER :: ABD_DOSSIER
        </h2>
        <div className="flex-1 h-[1px] bg-[var(--pcb-green-light)] opacity-30" />
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-16 items-start">
        <div className="space-y-8">
          <div className="relative group">
            <div className="absolute -inset-4 border border-[var(--terminal-green)] opacity-20 group-hover:opacity-100 transition-opacity animate-pulse" />
            <div 
              className="w-full aspect-square bg-[#111] overflow-hidden"
              style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            >
              <img 
                src="/profile.png" 
                alt="Profile" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black px-4 py-1 border border-[var(--pcb-green-light)] text-[10px] font-mono whitespace-nowrap">
              STATUS: <span className="text-[var(--terminal-green)] animate-pulse">● OPEN_TO_WORK</span>
            </div>
          </div>
          
        </div>

        <div className="pcb-card">
          <div className="mb-6 border-b border-[var(--pcb-green-light)] pb-4">
            <h3 className="text-lg font-mono text-[var(--terminal-green)] mb-2">ENGINEER_PROFILE_DATA</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {about.profile}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
