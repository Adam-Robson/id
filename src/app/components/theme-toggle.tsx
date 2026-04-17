"use client";
import "./theme-toggle.css";

import { useTheme } from "@/contexts/theme-provider";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="theme-toggle-wrapper">
      <button
        type="button"
        onClick={handleToggle}
        className={`theme-toggle${isDark ? " is-dark" : ""}`}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        aria-pressed={isDark}
      >
        <span className="theme-toggle-knob" />
      </button>
      <span className="theme-toggle-label">Toggle theme</span>
    </div>
  );
}
