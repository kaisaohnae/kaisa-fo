import React from "react";

export default function Custom500() {
  return (
    <div id="error">
      <div className="logo"><img src={process.env.NEXT_PUBLIC_IMG_HOST + '/common/logo.png'} width={140} alt=''/></div>
      <h2>알수 없는 에러가 발생하였습니다.</h2>
      <p>
        서비스 이용에 불편을 드려 죄송합니다.
      </p>
      <button
        className="big"
        type="button"
        onClick={() => (location.href = '/')}
      >
        홈으로
      </button>
    </div>
  );
}
