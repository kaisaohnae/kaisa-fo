import {CONNECTOR_SHARE, TIME_SLOT_USAGE} from './data';

const DONUT_RADIUS = 14;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

export default function Example2InsightCharts() {
  const ringTotal = CONNECTOR_SHARE.reduce((sum, item) => sum + item.value, 0);
  let accumulated = 0;

  return (
    <div className="ex2-insights">
      <div className="ex2-insights__row">
        <article className="ex2-mini-chart">
          <h3>커넥터 비율</h3>
          <p>최근 30일 충전 세션 기준</p>
          <div className="ex2-insights__donut ex2-insights__donut--stacked">
            <div className="ex2-insights__donut-chart">
              <svg viewBox="0 0 36 36" aria-hidden="true">
                {CONNECTOR_SHARE.map((item) => {
                  const arc = (item.value / ringTotal) * DONUT_CIRCUMFERENCE;
                  const segment = (
                    <circle
                      key={item.label}
                      cx="18"
                      cy="18"
                      r={DONUT_RADIUS}
                      fill="none"
                      stroke={item.color}
                      strokeWidth="5"
                      strokeLinecap="butt"
                      strokeDasharray={`${arc} ${DONUT_CIRCUMFERENCE - arc}`}
                      strokeDashoffset={-accumulated}
                      transform="rotate(-90 18 18)"
                    />
                  );
                  accumulated += arc;
                  return segment;
                })}
              </svg>
            </div>
            <ul className="ex2-insights__legend ex2-insights__legend--below">
              {CONNECTOR_SHARE.map((item) => (
                <li key={item.label}>
                  <span className="ex2-insights__swatch" style={{background: item.color}} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="ex2-mini-chart">
          <h3>시간대별 이용</h3>
          <p>피크 시간 17:00 — 20:00</p>
          <div className="ex2-insights__bars ex2-insights__bars--horizontal">
            {TIME_SLOT_USAGE.map((item) => (
              <div key={item.label} className="ex2-insights__bar-row">
                <span className="ex2-insights__bar-label">{item.label}</span>
                <div className="ex2-insights__bar-track">
                  <div className="ex2-insights__bar-fill" style={{width: `${item.value}%`}} />
                </div>
                <span className="ex2-insights__bar-value">{item.value}%</span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
