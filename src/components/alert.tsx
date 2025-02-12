'use client';

import React, { useCallback } from 'react';
import alertStore from '@/components/store/alert-store';

export default function AlertComponent() {
  const alert = alertStore(useCallback((state) => state.alert, []));
  const { hideAlert } = alertStore.getState();
  if (!alert) {
    return null;
  }
  return (
    <div id="alert">
      <div className="box">
        <div className="message">{alert.message}</div>
        <div className="buttons">
          {alert.button && alert.button.length > 0 ? (
            alert.button.map((btn: any, index: number) => (
              <button
                key={index}
                className={btn.type === 'on' ? 'on' : 'off'}
                style={btn.rate ? { flex: btn.rate } : { flex: 1 }}
                onClick={btn.callback}
              >
                {btn.text}
              </button>
            ))
          ) : (
            <button className="on" onClick={hideAlert}>
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
