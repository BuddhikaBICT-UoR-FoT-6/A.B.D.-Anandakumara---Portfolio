import React from 'react';
import { motion } from 'framer-motion';

const CHIP_DATA = {
  Arduino: { color: '#00979C', info: 'GPIO Array: 14 Digital / 6 Analog' },
  React: { color: '#61DAFB', info: 'State Management: Zustand / R3F' },
  'Spring Boot': { color: '#6DB33F', info: 'Context: IoC / Dependency Injection' },
  MQTT: { color: '#3C4958', info: 'Broker: Mosquitto / Pub-Sub' },
  ESP32: { color: '#E7352C', info: 'Connectivity: Dual-Core WiFi/BT' },
  GPIO: { color: '#00FF41', info: 'Logic Level: 3.3V CMOS' },
};

export default function TechChip({ name }) {
  const data = CHIP_DATA[name] || { color: '#666', info: '' };

  return (
    <span className="relative group inline-block mx-1">
      <motion.span
        whileHover={{ scale: 1.15 }}
        className="px-2 py-0.5 border border-[#004400] bg-black/50 text-[10px] rounded font-mono cursor-help"
        style={{ color: data.color }}
      >
        {name}
      </motion.span>

      {/* Floating Info Card */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-3 bg-black/90 border border-[#004400] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
        <div className="text-[10px] font-mono text-[#00FF41] mb-2 uppercase border-b border-[#004400] pb-1">
          {name}_MODULE
        </div>
        <div className="text-[9px] text-white/70 mb-3">
          {data.info}
        </div>
        
        {/* Placeholder for SVG Visualization */}
        <div className="h-12 border border-[#004400] bg-[#001100] relative overflow-hidden">
          {name === 'React' && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center opacity-30"
            >
              <div className="w-8 h-4 border border-[#61DAFB] rounded-full rotate-60" />
              <div className="w-8 h-4 border border-[#61DAFB] rounded-full -rotate-60" />
              <div className="w-8 h-4 border border-[#61DAFB] rounded-full" />
            </motion.div>
          )}
          {name === 'Spring Boot' && (
             <div className="absolute inset-0 flex items-center justify-center opacity-30">
               <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                 <div className="w-4 h-4 bg-[#6DB33F] rounded-full" />
                 <div className="w-0.5 h-6 bg-[#6DB33F] mx-auto mt-1" />
               </motion.div>
             </div>
          )}
          <div className="absolute bottom-1 right-1 text-[8px] text-[#004400]">SIM_RUNNING</div>
        </div>
      </div>
    </span>
  );
}
