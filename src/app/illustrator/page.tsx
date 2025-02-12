'use client';

import React, {useState, useEffect} from 'react';
import Title from '@/components/layout/title';
import illustratorList from '@/data/illustratorList';

export default function Page() {
  const title = '';

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted && (
    <div>
      <Title title={title}/>
      <div className="illustrator">
        <ul>
          {
            illustratorList.map((o: any, idx: number) => (
              <li
                key={idx}
              >
                <img src={o.url} alt=""/>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

