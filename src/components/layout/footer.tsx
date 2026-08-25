'use client';

import React from 'react';
import {LOCALE_OPTIONS} from '@/i18n/detect';
import {useLocale, useSetLocale} from '@/i18n/locale-context';

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

const Footer = () => {
  const locale = useLocale();
  const setLocale = useSetLocale();

  return (
    <footer id="footer" className="site-footer">
      <div className="site-shell">
        <div className="site-footer__inner site-shell__inner">
          <p className="site-footer__copy">© 2005 Kaisa. All Rights Reserved.</p>
          <div className="site-footer__aside">
            <div className="site-footer__langs" role="group" aria-label="Language">
              {LOCALE_OPTIONS.map(option => {
                const active = locale === option.locale;
                return (
                  <button
                    key={option.locale}
                    type="button"
                    className={active ? 'site-footer__lang site-footer__lang--active' : 'site-footer__lang'}
                    aria-pressed={active}
                    onClick={() => setLocale(option.locale, option.country)}
                  >
                    {option.locale.toUpperCase()}
                  </button>
                );
              })}
            </div>
            <a href="mailto:kaisa@kaisa.co.kr" className="site-footer__link">
              <IconMail />
              kaisa@kaisa.co.kr
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
