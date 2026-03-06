'use client';
import '@/components/theme-toggle.css';

import { useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const handleToggle = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <div className="theme-toggle-wrapper">
      <button
        onClick={handleToggle}
        className={`theme-toggle${isDark ? ' is-dark' : ''}`}
        aria-label="Toggle theme"
      >
        <span className="theme-toggle-knob" />
      </button>
      <span className="theme-toggle-label">Toggle theme</span>
    </div>
  );
}
