'use client';

import {useEffect, useState} from 'react';

export function useTodayLabel(locale = 'ko-KR') {
  const [label, setLabel] = useState('\u00A0');

  useEffect(() => {
    setLabel(
      new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }).format(new Date()),
    );
  }, [locale]);

  return label;
}
