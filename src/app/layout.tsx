/**
 * @file 루트 레이아웃 파일
 */
import type {Metadata} from 'next';
import {Syne, DM_Sans} from 'next/font/google';
import '@/assets/css/reset.css';
import '@/assets/css/styles.css';
import '@/ui-components/styles/ui-components.css';
import MetaTags from '@/components/layout/meta-tags';
import GoogleAnalytics from '@/components/layout/google-analytics';
import GoogleAdsense from '@/components/layout/google-adsense';
import {UiAlert, UiLoading, UiPopup} from '@/ui-components';
import ThemeProvider from '@/components/layout/theme-provider';
import {LocaleProvider} from '@/i18n/locale-context';
import {THEME_STORAGE_KEY} from '@/store/use-theme-store';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kaisa',
  description: 'Full-stack creative developer. Plan, design, and develop in one flow.',
};

/**
 * 전역으로 반복되는 레이아웃과 전역 CSS를 설정하는 컴포넌트
 *
 * @param children
 * @constructor
 */
export default function RootLayout({
                                     children
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
    <head>
      <GoogleAdsense />
    </head>
    <body>
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=null;document.cookie.split(';').forEach(function(c){var p=c.trim().split('=');if(p[0]==='${THEME_STORAGE_KEY}')t=decodeURIComponent(p[1]||'');});document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
      }}
    />
    <MetaTags />
    <GoogleAnalytics />
    <ThemeProvider />
    <LocaleProvider>
      {children}
    </LocaleProvider>
    <UiAlert />
    <UiLoading />
    <UiPopup />
    </body>
    </html>
  );
}
