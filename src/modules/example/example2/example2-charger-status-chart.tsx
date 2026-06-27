import {CHARGER_STATUS_BREAKDOWN, CHARGER_STATUS_TOTAL} from './data';

export default function Example2ChargerStatusChart() {
  return (
    <div className="ex2-status-chart">
      <div className="ex2-status-chart__stack" aria-hidden="true">
        {CHARGER_STATUS_BREAKDOWN.map((item) => (
          <span
            key={item.status}
            className="ex2-status-chart__stack-segment"
            style={{
              flex: item.count,
              background: item.color,
            }}
            title={`${item.label} ${item.count}대`}
          />
        ))}
      </div>

      <ul className="ex2-status-chart__list">
        {CHARGER_STATUS_BREAKDOWN.map((item) => {
          const ratio = Math.round((item.count / CHARGER_STATUS_TOTAL) * 100);

          return (
            <li key={item.status} className="ex2-status-chart__row">
              <span className="ex2-status-chart__dot" style={{background: item.color}} />
              <span className="ex2-status-chart__label">{item.label}</span>
              <div className="ex2-status-chart__track">
                <div
                  className="ex2-status-chart__fill"
                  style={{width: `${ratio}%`, background: item.color}}
                />
              </div>
              <span className="ex2-status-chart__count">{item.count}대</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
