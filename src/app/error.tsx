'use client';

import React from "react";

export default function Custom500() {
  return (
    <div id="error">
      {/*<div className="logo"><img src={process.env.NEXT_PUBLIC_IMG_HOST + '/common/logo.png'} width={140} alt=''/></div>*/}
      <p>
        알수 없는 에러가 발생하였습니다.
      </p>
      <a href="/" className="home">홈으로</a>
    </div>
  );
}
