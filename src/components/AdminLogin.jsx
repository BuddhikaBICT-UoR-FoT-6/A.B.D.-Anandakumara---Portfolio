import React, { useState, useEffect } from 'react';

export default function AdminLogin() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const onDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', onDown);
    return () => window.removeEventListener('keydown', onDown);
  }, []);

  const handleLogin = () => {
    if (password === 'buddhika2026') {
      sessionStorage.setItem('adminAuth', 'true');
      window.location.href = '/admin.html';
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay admin-modal-open" onClick={() => setIsOpen(false)}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-icon">🔐</div>
        <h2 className="admin-modal-title">Admin Access</h2>
        <p className="admin-modal-sub">Enter the admin password to continue.</p>
        <div className="admin-modal-field">
          <input
            type={showPassword ? "text" : "password"}
            className="admin-modal-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            autoFocus
          />
          <button 
            className="admin-modal-eye" 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        </div>
        <div className="admin-modal-actions">
          <button className="button" onClick={handleLogin}>Unlock →</button>
          <button className="button button-secondary" onClick={() => setIsOpen(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
