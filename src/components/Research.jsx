import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

const Research = () => {
  return (
    <section id="research" className="content-section py-10 md:py-20 px-5 md:px-10 max-w-6xl mx-auto relative z-10 text-white">
      <div className="section-header flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold tracking-widest uppercase" style={{ fontFamily: 'Times New Roman, serif' }}>Research</h2>
        <div className="flex-1 h-[1px] bg-white opacity-30" />
      </div>

      <div className="bg-[#050505]/80 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.02)] transition-all hover:border-white/20">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-2">
          <h3 className="text-xl font-bold leading-tight" style={{ fontFamily: 'Times New Roman, serif' }}>
            DualGuard: A Distance-Adaptive, Dual-Mode Person Recognition System for Residential CCTV
            <a href="https://github.com/BuddhikaBICT-UoR-FoT-6/DualGuard" target="_blank" rel="noreferrer" className="inline-flex items-center ml-3 text-white/50 hover:text-white transition-colors">
              <Github size={18} />
            </a>
          </h3>
          <span className="text-sm opacity-80 whitespace-nowrap font-serif">01/2026 — Present</span>
        </div>

        <div className="text-sm italic opacity-80 mb-5 font-serif">
          Present Tech Stack: Python, PyTorch, YOLOv8, OpenCV, InsightFace, Scikit-Learn
        </div>

        <ul className="list-disc pl-5 space-y-3 opacity-90 text-sm md:text-base leading-relaxed font-serif text-justify">
          <li>
            Investigated alert fatigue in residential IoT cameras caused by single-frame facial recognition failing in low-resolution transition zones, unable to distinguish residents from intruders at distance.
          </li>
          <li>
            Designed a three-zone pipeline driven by silhouette clearness: ArcFace recognition when the face is visible, RRDBNet super-resolution when degraded, and gait-based silhouette analysis when absent, with zone decisions made by a height-invariant Silhouette Shape Score (SSS) trained on CASIA-B and custom residential CCTV footage.
          </li>
          <li>
            Replaced single-frame decisions with a Sequential Probability Ratio Test (SPRT) accumulator to build evidence across frames, achieving 94% zone-prediction accuracy on real-world unconstrained footage.
          </li>
        </ul>

      </div>
    </section>
  );
};

export default Research;
