/** Hero example 지원 브라우저 아이콘 (IE / Chrome / Firefox / Safari) */
export default function HeroBrowserIcons() {
  return (
    <div className="hero__examples-browsers" aria-label="지원 브라우저">
      {/* Internet Explorer — blue badge + yellow orbit + white e */}
      <span className="hero__examples-browser" title="Internet Explorer">
        <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="15" fill="#0078D4" />
          <ellipse
            cx="16"
            cy="17.5"
            rx="13.5"
            ry="5.8"
            fill="none"
            stroke="#FABC09"
            strokeWidth="2.4"
            transform="rotate(-30 16 17.5)"
          />
          <path
            fill="#fff"
            d="M10.8 21.2c-1.2-.9-1.9-2.2-2-3.8h2.5c.1.9.5 1.7 1.2 2.2.6.5 1.5.8 2.5.8 1.1 0 2-.3 2.6-.8.6-.5 1-1.2 1-2.1 0-.9-.3-1.6-1-2-.6-.4-1.7-.7-3.1-.9l-1.4-.2c-2.1-.3-3.6-1-4.5-2-.9-1-1.4-2.3-1.4-3.8 0-1.6.6-2.9 1.8-3.8C12.2 4.3 13.8 3.8 15.7 3.8c1.8 0 3.3.5 4.4 1.4 1.1.9 1.8 2.2 2 3.8h-2.6c-.2-.9-.6-1.5-1.2-2-.6-.5-1.5-.7-2.5-.7-1 0-1.8.2-2.3.7-.5.4-.8 1.1-.8 1.8 0 .8.3 1.3.9 1.7.5.4 1.5.7 2.9.9l1.4.2c2.2.4 3.7 1 4.6 2 .9 1 1.4 2.3 1.4 3.9 0 1.7-.6 3-1.9 4-1.2 1-2.9 1.5-5 1.5-2 0-3.6-.5-4.8-1.5z"
          />
        </svg>
      </span>

      {/* Chrome — red / yellow / green petals + blue center */}
      <span className="hero__examples-browser" title="Chrome">
        <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="20" fill="#fff" />
          <path fill="#EA4335" d="M24 4c7.6 0 14.2 4.3 17.5 10.6L33 24H24l-5.2-9L24 4z" />
          <path fill="#FBBC05" d="M6.5 14.6 18.8 24H4C5.2 15.9 10.6 9.4 18 6.5l-11.5 8.1z" />
          <path fill="#34A853" d="M24 44c-7.6 0-14.2-4.3-17.5-10.6L15 24h9l5.2 9L24 44z" />
          <path fill="#4285F4" d="M41.5 33.4 29.2 24H44c-1.2 8.1-6.6 14.6-14 17.5l11.5-8.1z" />
          <circle cx="24" cy="24" r="7.5" fill="#fff" />
          <circle cx="24" cy="24" r="6" fill="#4285F4" />
        </svg>
      </span>

      {/* Firefox — orange globe + purple core */}
      <span className="hero__examples-browser" title="Firefox">
        <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
          <defs>
            <linearGradient id="ff-orb" x1="15%" y1="10%" x2="85%" y2="90%">
              <stop offset="0%" stopColor="#FFDA44" />
              <stop offset="40%" stopColor="#FF9500" />
              <stop offset="100%" stopColor="#E66000" />
            </linearGradient>
          </defs>
          <circle cx="16" cy="16" r="15" fill="url(#ff-orb)" />
          <path
            fill="#20123A"
            d="M16.2 8.2c-4.3 0-7.8 3.3-8 7.5 1.1-.4 2.8-.6 3.7.3.5-2.3 2-4.1 4.1-5.1-.3 1.1.1 2.4 1 3.2.7-1.9 2.3-3.3 4.2-3.8.3.9.4 1.8.2 2.7 1.5-.2 2.8.2 3.9 1.1-.8 2.2-2 3.8-3.5 5.2-1.4 1.9-3.5 3.1-5.9 3.1-3.9 0-7.1-3-7.3-6.8.9-.3 2.6-.6 3.5.3C11 12.5 13.4 10.8 16.2 10.8c.4 0 .8 0 1.2.1-.7-.9-1.1-2-1.2-2.7z"
            opacity="0.35"
          />
          <circle cx="16.5" cy="16.8" r="6.4" fill="#20123A" />
          <circle cx="16.5" cy="16.8" r="3.6" fill="#9059FF" />
          <path
            fill="#FF7139"
            d="M26.8 10.5s-1.2-.2-2.4 1.1c-.5-1.6-1.6-2.9-3.1-3.7.4 1.1.4 2.3 0 3.4-1.4-.7-3-.8-4.5-.3 1 .7 1.7 1.8 1.9 3-1.8 0-3.4.7-4.6 1.9 1.2.1 2.3.5 3.3 1.2-1.6 1-2.6 2.7-2.6 4.6 1.5-1.5 3.5-2.4 5.7-2.4 3.2 0 5.9 1.8 7.2 4.4.9-1.8 1.1-3.9.5-5.9.8.1 1.5.5 2 1.1.2-2.6-.8-5.1-2.4-7z"
          />
        </svg>
      </span>

      {/* Safari — blue compass */}
      <span className="hero__examples-browser" title="Safari">
        <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
          <defs>
            <linearGradient id="sf-face" x1="25%" y1="5%" x2="75%" y2="95%">
              <stop offset="0%" stopColor="#5AC8FA" />
              <stop offset="100%" stopColor="#007AFF" />
            </linearGradient>
          </defs>
          <circle cx="16" cy="16" r="15" fill="url(#sf-face)" />
          <circle cx="16" cy="16" r="11.8" fill="#F7FBFF" />
          <g stroke="#8E8E93" strokeLinecap="round">
            <line x1="16" y1="5.6" x2="16" y2="7.4" strokeWidth="1.4" />
            <line x1="16" y1="24.6" x2="16" y2="26.4" strokeWidth="1.4" />
            <line x1="5.6" y1="16" x2="7.4" y2="16" strokeWidth="1.4" />
            <line x1="24.6" y1="16" x2="26.4" y2="16" strokeWidth="1.4" />
            <line x1="8.4" y1="8.4" x2="9.6" y2="9.6" strokeWidth="1" />
            <line x1="22.4" y1="22.4" x2="23.6" y2="23.6" strokeWidth="1" />
            <line x1="23.6" y1="8.4" x2="22.4" y2="9.6" strokeWidth="1" />
            <line x1="9.6" y1="22.4" x2="8.4" y2="23.6" strokeWidth="1" />
          </g>
          <path fill="#FF3B30" d="M16 7.8 19.6 16 16 14.8 12.4 16z" />
          <path fill="#1C1C1E" d="M16 24.2 12.4 16 16 17.2 19.6 16z" />
        </svg>
      </span>
    </div>
  );
}
