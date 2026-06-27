import Example2ChargerStatusChart from './example2-charger-status-chart';
import Example2ChargerTypeChart from './example2-charger-type-chart';
import Example2EnergyChart from './example2-energy-chart';
import Example2EventIcon from './example2-event-icon';
import Example2InsightCharts from './example2-insight-charts';
import Example2OcppVersionChart from './example2-ocpp-version-chart';
import Example2PageHeader from './example2-page-header';
import Example2RevenueSnapshotChart from './example2-revenue-snapshot-chart';
import {
  CHARGERS,
  CHARGER_STATUS_LABEL,
  CHARGER_STATUS_TOTAL,
  LIVE_EVENTS,
  REVENUE_SUMMARY,
  SESSIONS,
  SESSION_STATUS_LABEL,
  STATION_NAME,
  STATS,
} from './data';

export default function Example2Dashboard() {
  return (
    <>
      <Example2PageHeader
        title={STATION_NAME}
        description="실시간 충전 현황 · 에너지 · 매출 요약"
        actions={
          <>
            <button type="button" className="ex2-btn ex2-btn--ghost">
              원격 점검
            </button>
            <button type="button" className="ex2-btn ex2-btn--primary">
              + 충전기 제어
            </button>
          </>
        }
      />

      <section className="ex2-stats">
        {STATS.map((stat) => (
          <article key={stat.id} className={`ex2-stat ex2-stat--${stat.tone}`}>
            <span className="ex2-stat__label">{stat.label}</span>
            <strong className="ex2-stat__value">{stat.value}</strong>
            <span className="ex2-stat__note">{stat.note}</span>
          </article>
        ))}
      </section>

      <section className="ex2-grid ex2-grid--2 ex2-grid--analytics">
        <article className="ex2-panel ex2-panel--revenue">
          <div className="ex2-panel__head ex2-panel__head--compact">
            <div>
              <h2>월별 충전량</h2>
              <p>최근 12개월 kWh 추이</p>
            </div>
          </div>
          <div className="ex2-revenue__summary ex2-revenue__summary--inline">
            <div className="ex2-revenue__metric">
              <span>누적 충전량</span>
              <strong>198.6 MWh</strong>
            </div>
            <div className="ex2-revenue__metric">
              <span>월 평균</span>
              <strong>16.6 MWh</strong>
            </div>
            <div className="ex2-revenue__metric ex2-revenue__metric--up">
              <span>전월 대비</span>
              <strong>+6.8%</strong>
            </div>
          </div>
          <Example2EnergyChart compact />
        </article>

        <article className="ex2-panel ex2-panel--insights">
          <div className="ex2-panel__head ex2-panel__head--compact">
            <div>
              <h2>운영 인사이트</h2>
              <p>커넥터 · 시간대 분석</p>
            </div>
          </div>
          <Example2InsightCharts />
        </article>
      </section>

      <section className="ex2-grid ex2-grid--2 ex2-grid--rooms">
        <article className="ex2-panel">
          <div className="ex2-panel__head">
            <div>
              <h2>충전기 상태</h2>
              <p>전체 {CHARGER_STATUS_TOTAL}기 기준</p>
            </div>
            <span className="ex2-panel__badge">충전 중 4</span>
          </div>
          <Example2ChargerStatusChart />
          <Example2ChargerTypeChart />
          <Example2OcppVersionChart />
        </article>

        <article className="ex2-panel ex2-panel--rooms">
          <div className="ex2-panel__head">
            <div>
              <h2>충전기 현황</h2>
              <p>실시간 6기 모니터링</p>
            </div>
            <span className="ex2-panel__badge ex2-panel__badge--live">LIVE</span>
          </div>
          <div className="ex2-chargers">
            {CHARGERS.map((charger) => (
              <article key={charger.id} className={`ex2-charger ex2-charger--${charger.status}`}>
                <div className="ex2-charger__top">
                  <span className="ex2-charger__id">{charger.id}</span>
                  <span className={`ex2-badge ex2-badge--${charger.status}`}>
                    {CHARGER_STATUS_LABEL[charger.status]}
                  </span>
                </div>
                <strong className="ex2-charger__name">{charger.name}</strong>
                <span className="ex2-charger__spec">{charger.type}</span>
                {charger.vehicle ? (
                  <p className="ex2-charger__session">
                    {charger.vehicle}
                    <span>{charger.detail}</span>
                  </p>
                ) : (
                  <p className="ex2-charger__session ex2-charger__session--empty">대기 중</p>
                )}
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="ex2-grid ex2-grid--2">
        <article className="ex2-panel">
          <div className="ex2-panel__head">
            <div>
              <h2>실시간 이벤트</h2>
              <p>충전 시작 · 완료 · 알림</p>
            </div>
          </div>
          <ul className="ex2-events">
            {LIVE_EVENTS.map((item) => (
              <li key={item.id} className={`ex2-events__item ex2-events__item--${item.type}`}>
                <span className="ex2-events__icon" aria-hidden="true">
                  <Example2EventIcon type={item.type} />
                </span>
                <div className="ex2-events__body">
                  <div className="ex2-events__row">
                    <strong>{item.time}</strong>
                    <span>{item.charger}</span>
                    <span className="ex2-events__tag">
                      {item.type === 'start' ? '시작' : item.type === 'end' ? '완료' : '알림'}
                    </span>
                  </div>
                  <p>
                    {item.vehicle} · {item.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="ex2-panel">
          <div className="ex2-panel__head">
            <div>
              <h2>매출 스냅샷</h2>
              <p>최근 12개월 요약</p>
            </div>
          </div>
          <div className="ex2-revenue__summary ex2-revenue__summary--stacked">
            <div className="ex2-revenue__metric">
              <span>누적 매출</span>
              <strong>{REVENUE_SUMMARY.total}</strong>
            </div>
            <div className="ex2-revenue__metric">
              <span>월 평균</span>
              <strong>{REVENUE_SUMMARY.average}</strong>
            </div>
            <div className="ex2-revenue__metric ex2-revenue__metric--up">
              <span>전년 대비</span>
              <strong>{REVENUE_SUMMARY.growth}</strong>
            </div>
          </div>
          <Example2RevenueSnapshotChart />
        </article>
      </section>

      <section className="ex2-panel ex2-panel--table">
        <div className="ex2-panel__head">
          <div>
            <h2>최근 충전 이력</h2>
            <p>회원 · 차량 · kWh</p>
          </div>
          <button type="button" className="ex2-btn ex2-btn--ghost ex2-btn--sm">
            전체 보기
          </button>
        </div>
        <div className="ex2-table-wrap">
          <table className="ex2-table">
            <thead>
              <tr>
                <th>세션 ID</th>
                <th>회원</th>
                <th>차량</th>
                <th>충전기</th>
                <th>kWh</th>
                <th>금액</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {SESSIONS.slice(0, 5).map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.member}</td>
                  <td>{row.vehicle}</td>
                  <td>{row.charger}</td>
                  <td>{row.kwh}</td>
                  <td>{row.amount}</td>
                  <td>
                    <span className={`ex2-badge ex2-badge--${row.status}`}>
                      {SESSION_STATUS_LABEL[row.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
