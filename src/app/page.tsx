'use client';

import React, {useEffect, useState} from 'react';
import Title from '@/components/layout/title';
import worksList from '@/data/worksList';

export default function Page() {
  const title = '';

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted && (
    <div>
      <Title title={title}/>
      <div className="works">
        <ul>
          {
            worksList.map((o: any, idx: number) => (
              <li
                key={idx}
              >
                <p>{o.date} - <strong>{o.title}</strong></p>
                <img src={o.url} alt='' />
                <div>{o.skil}</div>
              </li>
            ))
          }
        </ul >
      </div>
    </div>
  );
}
