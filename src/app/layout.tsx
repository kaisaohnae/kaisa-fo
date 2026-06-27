/**
 * @file 루트 레이아웃 파일
 */
import type {Metadata} from 'next';
import {Syne, DM_Sans} from 'next/font/google';
import '@/assets/css/reset.css';
import '@/assets/css/styles.css';
import MetaTags from '@/components/layout/meta-tags';
import Alert from '@/components/alert';
import Loading from '@/components/loading';
import LayoutSub from '@/app/layout-sub';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ThemeProvider from '@/components/layout/theme-provider';
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
  title: 'Kaisa — Design · Develop · Plan',
  description: '20년 경력의 풀스택 크리에이티브 개발자. 기획, 디자인, 개발을 하나의 흐름으로 완성합니다.',
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
    <html lang="ko" className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
    <MetaTags />
    <body>
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=null;document.cookie.split(';').forEach(function(c){var p=c.trim().split('=');if(p[0]==='${THEME_STORAGE_KEY}')t=decodeURIComponent(p[1]||'');});document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
      }}
    />
    <ThemeProvider />
    <Header />
    <LayoutSub>{children}</LayoutSub>
    <Footer />
    <Alert />
    <Loading />
    </body>
    </html>
  );
}
