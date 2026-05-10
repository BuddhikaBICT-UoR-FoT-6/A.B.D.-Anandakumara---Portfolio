import React from 'react';

const SectionDivider = () => {
  return (
    <div className="w-full flex items-center justify-center py-16 opacity-30">
      <div className="w-4 h-4 rounded-full border border-[var(--pcb-green-light)]" />
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[var(--pcb-green-light)] to-transparent" />
      <div className="w-4 h-4 rounded-full border border-[var(--pcb-green-light)]" />
    </div>
  );
};

export default SectionDivider;
