import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [form, setForm] = useState({ name: '', message: '', channel: 'JOB_OFFER' });
  const [messages, setMessages] = useState([
    { id: 1, sender: 'RECRUITER_01', text: 'Interested in your IoT work. Available for chat?' },
    { id: 2, sender: 'SYSTEM', text: 'Message delivered. Response pending...' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      id: Date.now(),
      sender: 'SENDER_ID: ' + form.name,
      text: `[${form.channel}] > ${form.message}`
    };
    setMessages(prev => [...prev, newMessage]);
    setForm({ name: '', message: '', channel: 'JOB_OFFER' });
    
    // Trigger shockwave effect (manual dispatch for now)
    window.dispatchEvent(new CustomEvent('transmit-packet'));
  };

  return (
    <section id="contact" className="py-32 px-8 max-w-6xl mx-auto relative z-10">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-mono text-[var(--terminal-green)]">
          // SECTION_04 :: SERIAL_MONITOR
        </h2>
        <div className="flex-1 h-[1px] bg-[var(--pcb-green-light)] opacity-30" />
      </div>

      <div className="pcb-card border-[var(--pcb-green-light)] overflow-hidden p-0">
        <div className="bg-[#111] border-b border-[var(--pcb-green-light)] px-4 py-2 flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-4">
            <span className="text-[var(--pcb-green-light)]">Serial Monitor — 115200 baud</span>
            <span className="text-[var(--terminal-green)]">● CONNECTED</span>
          </div>
          <div className="text-[var(--pcb-green-light)]">A.B.D. Anandakumara</div>
        </div>

        <div className="grid md:grid-cols-[1fr_300px]">
          <div className="bg-black/40 p-6 flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto space-y-4 font-mono text-xs mb-6 scrollbar-hide">
              {messages.map(msg => (
                <div key={msg.id} className="animate-in fade-in slide-in-from-left-2">
                  <span className={msg.sender === 'SYSTEM' ? 'text-[var(--terminal-yellow)]' : 'text-[var(--terminal-green)]'}>
                    [{msg.sender}]
                  </span>
                  <span className="text-white opacity-80 ml-2">{'>'} {msg.text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 border-t border-[var(--pcb-green-light)]/20 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[var(--pcb-green-light)]">SENDER_ID:</label>
                  <input 
                    type="text" 
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full bg-[#050505] border border-[var(--pcb-green-light)] text-[var(--terminal-green)] font-mono text-xs p-2 focus:ring-1 focus:ring-[var(--terminal-green)] outline-none"
                    placeholder="ENTER_NAME"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[var(--pcb-green-light)]">CHANNEL:</label>
                  <select 
                    value={form.channel}
                    onChange={e => setForm({...form, channel: e.target.value})}
                    className="w-full bg-[#050505] border border-[var(--pcb-green-light)] text-[var(--terminal-green)] font-mono text-xs p-2 focus:ring-1 focus:ring-[var(--terminal-green)] outline-none"
                  >
                    <option value="JOB_OFFER">JOB_OFFER ▼</option>
                    <option value="COLLABORATION">COLLABORATION ▼</option>
                    <option value="PROJECT">PROJECT ▼</option>
                    <option value="GENERAL">GENERAL ▼</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--pcb-green-light)]">PAYLOAD:</label>
                <textarea 
                  rows="3"
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full bg-[#050505] border border-[var(--pcb-green-light)] text-[var(--terminal-green)] font-mono text-xs p-2 focus:ring-1 focus:ring-[var(--terminal-green)] outline-none resize-none"
                  placeholder="TRANSMIT_DATA_HERE..."
                  required
                />
              </div>
              <button type="submit" className="btn-terminal w-full py-3">
                → TRANSMIT_PACKET
              </button>
            </form>
          </div>

          <div className="bg-[#111] p-6 border-l border-[var(--pcb-green-light)] space-y-8">
            <div>
              <h3 className="text-[10px] font-mono text-[var(--pcb-green-light)] mb-4">I²C_DEVICE_ADDRESSES</h3>
              <div className="space-y-4">
                <a href="#" className="flex flex-col group">
                  <span className="text-[10px] font-mono text-[var(--terminal-green)]">I²C[0x01]</span>
                  <span className="text-xs font-mono opacity-60 group-hover:opacity-100 group-hover:text-white transition-all">github.com/abdanandakumara</span>
                </a>
                <a href="#" className="flex flex-col group">
                  <span className="text-[10px] font-mono text-[var(--terminal-green)]">I²C[0x02]</span>
                  <span className="text-xs font-mono opacity-60 group-hover:opacity-100 group-hover:text-white transition-all">linkedin.com/in/abd</span>
                </a>
                <a href="#" className="flex flex-col group">
                  <span className="text-[10px] font-mono text-[var(--terminal-green)]">I²C[0x03]</span>
                  <span className="text-xs font-mono opacity-60 group-hover:opacity-100 group-hover:text-white transition-all">engineer@abd.dev</span>
                </a>
              </div>
            </div>

            <div className="pt-8 border-t border-[var(--pcb-green-light)]/20 text-center">
              <div className="text-[8px] font-mono text-[var(--pcb-green-light)] mb-2">LAST_PACKET_INFO</div>
              <div className="text-[10px] font-mono text-[var(--terminal-yellow)] animate-pulse">
                PACKET_SENT · ACK received · 12ms latency
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
