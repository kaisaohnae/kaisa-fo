import React, {useState, useEffect} from 'react';
import Title from '@/components/layout/title';
import RootLayout from '@/components/root-layout';
import {ReactElement} from 'react';
import { motion } from 'framer-motion';
import illustratorList from '@/data/illustratorList';

export default function Page(): ReactElement {
  const title = '';

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <Title title={title}/>
      <div className="illustrator">
        <ul>
          {
            illustratorList.map((o: any, idx: number) => (
              <motion.li
                initial={{opacity: 0, marginLeft: -30}}
                animate={{opacity: 1, marginLeft: 0}}
                transition={{duration: 0.5}}
                key={idx}
              >
                <img src={o.url} alt=""/>
              </motion.li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout>{page}</RootLayout>;
};
