import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '', channel: 'Job Offer' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: `[${form.channel}] ${form.message}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '', channel: 'Job Offer' });
      window.dispatchEvent(new CustomEvent('transmit-packet'));
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="content-section py-32 px-8 max-w-6xl mx-auto relative z-10">
      <div className="section-header flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-mono text-[var(--terminal-green)]">
          Contact
        </h2>
        <div className="flex-1 h-[1px] bg-[var(--pcb-green-light)] opacity-30" />
      </div>

      <div className="pcb-card border-[var(--pcb-green-light)] overflow-hidden p-0">
        {/* Terminal bar */}
        <div className="bg-[#111] border-b border-[var(--pcb-green-light)] px-4 py-2 flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-4">
            <span className="text-[var(--pcb-green-light)]">Send me a message</span>
            <span className="text-[var(--terminal-green)]">● Online</span>
          </div>
          <div className="text-[var(--pcb-green-light)]">A.B.D. Anandakumara</div>
        </div>

        <div className="grid md:grid-cols-[1fr_300px]">
          {/* Form */}
          <div className="bg-black/40 p-6 flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[var(--pcb-green-light)]">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#050505] border border-[var(--pcb-green-light)] text-[var(--terminal-green)] font-mono text-xs p-2 focus:ring-1 focus:ring-[var(--terminal-green)] outline-none"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[var(--pcb-green-light)]">Subject</label>
                  <select
                    value={form.channel}
                    onChange={e => setForm({ ...form, channel: e.target.value })}
                    className="w-full bg-[#050505] border border-[var(--pcb-green-light)] text-[var(--terminal-green)] font-mono text-xs p-2 focus:ring-1 focus:ring-[var(--terminal-green)] outline-none"
                  >
                    <option value="Job Offer">Job Offer</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Project">Project</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--pcb-green-light)]">Your Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#050505] border border-[var(--pcb-green-light)] text-[var(--terminal-green)] font-mono text-xs p-2 focus:ring-1 focus:ring-[var(--terminal-green)] outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--pcb-green-light)]">Message</label>
                <textarea
                  rows="4"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-[#050505] border border-[var(--pcb-green-light)] text-[var(--terminal-green)] font-mono text-xs p-2 focus:ring-1 focus:ring-[var(--terminal-green)] outline-none resize-none"
                  placeholder="Write your message here..."
                  required
                />
              </div>

              {/* Status feedback */}
              {status === 'success' && (
                <div className="text-[var(--terminal-green)] font-mono text-xs py-2">
                  ✓ Message sent! I'll get back to you within 24–48 hours.
                </div>
              )}
              {status === 'error' && (
                <div className="text-[var(--terminal-yellow)] font-mono text-xs py-2">
                  ✗ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-terminal w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? '⟳ Sending...' : '→ Send Message'}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="bg-[#111] p-6 border-l border-[var(--pcb-green-light)] space-y-8">
            <div>
              <h3 className="text-[10px] font-mono text-[var(--pcb-green-light)] mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <a href="https://github.com/BuddhikaBICT-UoR-FoT-6" target="_blank" rel="noreferrer" className="flex flex-col group">
                  <span className="text-[10px] font-mono text-[var(--terminal-green)]">GitHub</span>
                  <span className="text-xs font-mono opacity-60 group-hover:opacity-100 group-hover:text-white transition-all">github.com/BuddhikaBICT</span>
                </a>
                <a href="https://www.linkedin.com/in/buddhika-darshan-9b9168252/" target="_blank" rel="noreferrer" className="flex flex-col group">
                  <span className="text-[10px] font-mono text-[var(--terminal-green)]">LinkedIn</span>
                  <span className="text-xs font-mono opacity-60 group-hover:opacity-100 group-hover:text-white transition-all">linkedin.com/in/buddhika-darshan</span>
                </a>
                <div className="flex items-center justify-between group">
                  <a href="mailto:buddhikadarshan1475@gmail.com" className="flex flex-col">
                    <span className="text-[10px] font-mono text-[var(--terminal-green)]">Email</span>
                    <span className="text-xs font-mono opacity-60 group-hover:opacity-100 group-hover:text-white transition-all">buddhikadarshan1475@gmail.com</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('buddhikadarshan1475@gmail.com');
                      alert('Email copied to clipboard!');
                    }}
                    className="p-2 opacity-20 hover:opacity-100 hover:text-[var(--terminal-yellow)] transition-all"
                    title="Copy Email"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[var(--pcb-green-light)]/20 text-center">
              <div className="text-[8px] font-mono text-[var(--pcb-green-light)] mb-2">Response Time</div>
              <div className="text-[10px] font-mono text-[var(--terminal-yellow)] animate-pulse">
                Usually within 24–48 hours
              </div>
              <div className="text-[8px] font-mono opacity-40 mt-4">
                For urgent matters, reach out<br />directly via email or LinkedIn.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
