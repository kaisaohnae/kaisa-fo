'use client';

import React from 'react';

export default function Custom404() {
  return (
    <div id="error">
      <p>요청하신 페이지를 찾을 수 없습니다.</p>
      <a href="/" className="home">홈으로</a>
    </div>
  );
}
