'use client';

import React, { useCallback } from 'react';
import loadingStore from '@/components/store/loading-store';

export default function AlertComponent() {
  const loading = loadingStore(useCallback((state) => state.loading, []));

  if (!loading) {
    return null;
  }
  return (
    <div id="loading">
      <div className="icon"></div>
    </div>
  );
}
