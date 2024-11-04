import {ReactElement, useEffect, useState} from 'react';
import {notoSansKr} from '@/etc/fonts';
import MetaTags from '@/components/layout/meta-tags';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function RootLayout({children}: { children: ReactElement }) {
  const [rootReady, setRootReady] = useState(false);

  useEffect(() => {
    setRootReady(true);
  }, []);

  return (
    <div className={`${notoSansKr.className}`}>
      {rootReady && (
        <>
          <MetaTags/>
          <div id="wrapper">
            <Header/>
            <div id="container">
              {children}
            </div>
            <Footer/>
          </div>
        </>
      )}
    </div>
  );
}
