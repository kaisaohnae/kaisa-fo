import {OCPP_VERSION_SHARE} from './data';

export default function Example2OcppVersionChart() {
  const total = OCPP_VERSION_SHARE.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="ex2-ocpp-chart">
      <div className="ex2-ocpp-chart__head">
        <h3>OCPP 버전 점유율</h3>
        <p>등록 충전기 {total}기 기준</p>
      </div>

      <div className="ex2-ocpp-chart__cols">
        {OCPP_VERSION_SHARE.map((item) => {
          const share = Math.round((item.count / total) * 100);

          return (
            <div key={item.version} className="ex2-ocpp-chart__col">
              <span className="ex2-ocpp-chart__value">{share}%</span>
              <div className="ex2-ocpp-chart__bar">
                <div
                  className="ex2-ocpp-chart__fill"
                  style={{height: `${share}%`, background: item.color}}
                />
              </div>
              <span className="ex2-ocpp-chart__label">{item.label}</span>
              <span className="ex2-ocpp-chart__count">{item.count}기</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
