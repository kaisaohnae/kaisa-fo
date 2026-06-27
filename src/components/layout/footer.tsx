'use client';

import React from 'react';

const IconMail = () => (
  <svg
    className="site-footer__icon"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

const IconPhone = () => (
  <svg
    className="site-footer__icon"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const Footer = () => {
  return (
    <footer id="footer" className="site-footer">
      <div className="site-shell">
        <div className="site-footer__inner site-shell__inner">
          <p className="site-footer__copy">
            © 2005 Kaisa. All Rights Reserved.
          </p>
          <div className="site-footer__contact">
            <a href="mailto:7083620@hanmail.net" className="site-footer__link">
              <IconMail />
              7083620@hanmail.net
            </a>
            <a href="tel:01073115111" className="site-footer__link">
              <IconPhone />
              010.7311.5111
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
