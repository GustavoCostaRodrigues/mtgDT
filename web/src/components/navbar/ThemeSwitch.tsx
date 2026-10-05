import type React from 'react';

interface ThemeSwitchProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function ThemeSwitch({ theme, onToggle, className = '', style }: ThemeSwitchProps) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-switch ${isDark ? 'is-dark' : ''} ${className}`}
      style={style}
      role="switch"
      aria-checked={isDark}
      aria-label="Alternar tema"
      onClick={onToggle}
    >
      <span className="theme-switch-track">
        <svg className="theme-switch-art" viewBox="0 0 70 44" preserveAspectRatio="none" aria-hidden="true">
          <rect className="switch-sky" x="1" y="1" width="68" height="42" rx="21" />
          <g className="switch-orb">
            <g className="switch-sun-group">
              <circle className="switch-sun" cx="17" cy="22" r="12" />
              <circle className="switch-sun-inner" cx="17" cy="22" r="6" />
            </g>
            <g className="switch-moon">
              <circle cx="53" cy="22" r="12" />
              <circle cx="48" cy="17" r="1.8" />
              <circle cx="56" cy="27" r="1.8" />
              <circle cx="58" cy="16" r="1.3" />
              <circle cx="50" cy="29" r="1.3" />
            </g>
          </g>
          <path className="switch-cloud" d="M44 22c2-3 5-3 7-1 0-4 6-5 7-1 4-1 6 4 2 6h-15c-4 0-5-3-1-4Z" />
          <g className="switch-stars">
            <circle cx="16" cy="13" r="1" />
            <circle cx="27" cy="29" r="1" />
            <circle cx="34" cy="12" r=".8" />
            <circle cx="10" cy="25" r=".8" />
          </g>
        </svg>
      </span>
    </button>
  );
}

export default ThemeSwitch;
