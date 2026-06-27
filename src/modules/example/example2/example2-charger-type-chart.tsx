import {CHARGER_TYPE_ERROR_RATE} from './data';

const MAX_RATE = 3;

export default function Example2ChargerTypeChart() {
  return (
    <div className="ex2-error-chart">
      <div className="ex2-error-chart__head">
        <h3>유형별 에러 발생률</h3>
        <p>최근 30일 · 세션 대비</p>
      </div>

      <ul className="ex2-error-chart__list">
        {CHARGER_TYPE_ERROR_RATE.map((item) => (
          <li key={item.label} className="ex2-error-chart__row">
            <span className="ex2-error-chart__label">{item.label}</span>
            <div className="ex2-error-chart__track">
              <span
                className="ex2-error-chart__stem"
                style={{width: `${Math.max(8, (item.value / MAX_RATE) * 100)}%`}}
              />
              <span
                className="ex2-error-chart__dot"
                style={{left: `${Math.max(8, (item.value / MAX_RATE) * 100)}%`}}
              />
            </div>
            <span className="ex2-error-chart__value">{item.value}%</span>
            <span className="ex2-error-chart__count">{item.incidents}건</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
