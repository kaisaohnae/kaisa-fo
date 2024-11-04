import React from "react";

export default function Custom404() {
  return (
    <div id="error">
      <div className="logo"><img src={process.env.NEXT_PUBLIC_IMG_HOST + '/common/logo.png'} width={140} alt=''/></div>
      <h2>요청하신 페이지를 찾을 수 없습니다.</h2>
      <p>
        입력하신 주소가 올바르지 않거나사용이 일시 중단되어 요청하신 페이지를 찾을 수 없습니다.<br/>
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
