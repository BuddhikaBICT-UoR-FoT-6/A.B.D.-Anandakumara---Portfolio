import React from 'react';
import { Zap, Brain, Globe, Database, Wrench } from 'lucide-react';

const skillCategories = [
  {
    title: 'Programming',
    icon: <Zap size={20} className="text-[#ff7b00] mb-4" />,
    skills: [
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
      { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
      { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg' },
      { name: 'R', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/r/r-original.svg' },
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
    ]
  },
  {
    title: 'AI / Machine Learning',
    icon: <Brain size={20} className="text-[#ff55a3] mb-4" />,
    skills: [
      { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg' },
      { name: 'Scikit-learn', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg' },
      { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg' },
      { name: 'NumPy', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg' },
      { name: 'NLP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
      { name: 'Transformers', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg' },
      { name: 'LLMs', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openai/openai-original.svg' },
      { name: 'Matplotlib', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matplotlib/matplotlib-original.svg' },
    ]
  },
  {
    title: 'Web & Apps',
    icon: <Globe size={20} className="text-[#3b82f6] mb-4" />,
    skills: [
      { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
      { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
      { name: 'Flask', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg' },
      { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg' },
    ]
  },
  {
    title: 'Databases',
    icon: <Database size={20} className="text-[#8b5cf6] mb-4" />,
    skills: [
      { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
      { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
      { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg' },
    ]
  },
  {
    title: 'Tools & Platforms',
    icon: <Wrench size={20} className="text-[#a8a29e] mb-4" />,
    skills: [
      { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
      { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg' },
      { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
      { name: 'Kaggle', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kaggle/kaggle-original.svg' },
    ]
  }
];

const Skills = () => {
  return (
    <section id="skills" className="content-section py-10 md:py-20 px-5 md:px-10 max-w-6xl mx-auto relative z-10">
      <div className="section-header flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-bold text-white tracking-wide">Technical Arsenal</h2>
        <div className="flex-1 h-[1px] bg-white/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, index) => (
          <div 
            key={category.title} 
            className="bg-[#050505]/90 backdrop-blur-md rounded-2xl p-6 border border-[#a855f7]/30 shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all duration-300 hover:border-[#a855f7]/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:-translate-y-1"
          >
            {category.icon}
            <h3 className="text-lg font-semibold text-white mb-6 tracking-wide">{category.title}</h3>
            
            <div className="flex flex-wrap gap-x-6 gap-y-6">
              {category.skills.map(skill => (
                <div key={skill.name} className="flex flex-col items-center gap-2 w-[60px] group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/10">
                    <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] text-white/60 font-medium tracking-wider group-hover:text-white/90 text-center transition-colors">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
