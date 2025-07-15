'use client';

import React, { useCallback } from 'react';
import useLoadingStore from '@/store/use-loading-store';

export default function AlertComponent() {
  const loading = useLoadingStore(useCallback((state) => state.loading, []));

  if (!loading) {
    return null;
  }
  return (
    <div id="loading">
      <div className="icon"></div>
    </div>
  );
}
