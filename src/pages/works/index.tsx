import React, {useState, useEffect} from 'react';
import Title from '@/components/layout/title';
import RootLayout from '@/components/root-layout';
import {ReactElement} from 'react';
import { motion } from 'framer-motion';
import worksList from '@/data/worksList';

export default function Page(): ReactElement {
  const title = '';

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <Title title={title}/>
      <div className="works">
        <ul>
          {
            worksList.map((o: any, idx: number) => (
              <motion.li
                initial={{ opacity: 0, marginLeft: -30 }}
                animate={{ opacity: 1, marginLeft: 0 }}
                transition={{ duration: 0.5 }}
                key={idx}
              >
                <p>{o.date} - <strong>{o.title}</strong></p>
                <img src={o.url} alt='' />
                <div>{o.skil}</div>
              </motion.li>
            ))
          }
        </ul >
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout>{page}</RootLayout>;
};
