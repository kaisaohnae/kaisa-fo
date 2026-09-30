import './tool-styles';
import Header from '@/components/layout/header';
import ToolCategoryNav from '@/components/layout/tool-category-nav';
import Footer from '@/components/layout/footer';
import {LocaleProvider} from '@/i18n/locale-context';

export default function ToolsLayout({children}: {children: React.ReactNode}) {
  return (
    <LocaleProvider>
      <Header />
      <main className="site-main">
        <ToolCategoryNav />
        {children}
      </main>
      <Footer />
    </LocaleProvider>
  );
}
