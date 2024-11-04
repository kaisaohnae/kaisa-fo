export default function Custom404() {
  return (
    <div>
      <div id="wrapper">
        <div id="container">
          <section className="error-page">
            <h2>요청하신 페이지를 찾을 수 없습니다.</h2>
            <p>
              입력하신 주소가 올바르지 않거나
              <br/>
              사용이 일시 중단되어 요청하신 페이지를 찾을 수 없습니다.
              <br/>
              <br/>
              서비스 이용에 불편을 드려 죄송합니다.
            </p>
            <div className="mgt50px">
              <button
                className="btns ver-large blueBtn"
                onClick={() => (location.href = '/')}
              >
                확인
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
