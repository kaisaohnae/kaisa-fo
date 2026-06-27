import Example1Calendar from './example1-calendar';
import Example1InsightCharts from './example1-insight-charts';
import Example1PageHeader from './example1-page-header';
import Example1RevenueChart from './example1-revenue-chart';
import {
  OCCUPANCY_BARS,
  PENSION_NAME,
  RESERVATIONS,
  RESERVATION_STATUS_LABEL,
  REVENUE_SUMMARY,
  ROOMS,
  ROOM_STATUS_LABEL,
  STATS,
  TODAY_SCHEDULE,
} from './data';

export default function Example1Dashboard() {
  return (
    <>
      <Example1PageHeader
        title={PENSION_NAME}
        description="오늘의 운영 현황과 매출 · 예약 요약"
        actions={
          <>
            <button type="button" className="ex1-btn ex1-btn--ghost">
              예약 캘린더
            </button>
            <button type="button" className="ex1-btn ex1-btn--primary">
              + 신규 예약
            </button>
          </>
        }
      />
      <section className="ex1-stats">
        {STATS.map((stat) => (
          <article key={stat.id} className={`ex1-stat ex1-stat--${stat.tone}`}>
            <span className="ex1-stat__label">{stat.label}</span>
            <strong className="ex1-stat__value">{stat.value}</strong>
            <span className="ex1-stat__note">{stat.note}</span>
          </article>
        ))}
      </section>

      <section className="ex1-grid ex1-grid--2 ex1-grid--analytics">
        <article className="ex1-panel ex1-panel--revenue">
          <div className="ex1-panel__head ex1-panel__head--compact">
            <div>
              <h2>지난 2년 매출 추이</h2>
              <p>월별 총 매출 · 2024.07 — 2026.06</p>
            </div>
          </div>
          <div className="ex1-revenue__summary ex1-revenue__summary--inline">
            <div className="ex1-revenue__metric">
              <span>총 매출</span>
              <strong>{REVENUE_SUMMARY.total}</strong>
            </div>
            <div className="ex1-revenue__metric">
              <span>월 평균</span>
              <strong>{REVENUE_SUMMARY.average}</strong>
            </div>
            <div className="ex1-revenue__metric ex1-revenue__metric--up">
              <span>전년 대비</span>
              <strong>{REVENUE_SUMMARY.growth}</strong>
            </div>
          </div>
          <Example1RevenueChart compact />
        </article>

        <article className="ex1-panel ex1-panel--insights">
          <div className="ex1-panel__head ex1-panel__head--compact">
            <div>
              <h2>매출 인사이트</h2>
              <p>채널 · 숙박 · 객실 타입 분석</p>
            </div>
          </div>
          <Example1InsightCharts />
        </article>
      </section>

      <section className="ex1-grid ex1-grid--2 ex1-grid--rooms">
        <article className="ex1-panel">
          <div className="ex1-panel__head">
            <div>
              <h2>주간 가동률</h2>
              <p>최근 7일 객실 점유율</p>
            </div>
            <span className="ex1-panel__badge">평균 71%</span>
          </div>
          <div className="ex1-chart">
            {OCCUPANCY_BARS.map((bar) => (
              <div key={bar.label} className="ex1-chart__col">
                <span className="ex1-chart__value">{bar.value}%</span>
                <div className="ex1-chart__bar-wrap">
                  <div className="ex1-chart__bar" style={{height: `${bar.value}%`}} />
                </div>
                <span className="ex1-chart__label">{bar.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="ex1-panel ex1-panel--rooms">
          <div className="ex1-panel__head">
            <div>
              <h2>객실 현황</h2>
              <p>실시간 6개 객실</p>
            </div>
            <span className="ex1-panel__badge ex1-panel__badge--live">LIVE</span>
          </div>
          <div className="ex1-rooms">
            {ROOMS.map((room) => (
              <article key={room.id} className={`ex1-room ex1-room--${room.status}`}>
                <div className="ex1-room__top">
                  <span className="ex1-room__id">{room.id}</span>
                  <span className={`ex1-badge ex1-badge--${room.status}`}>
                    {ROOM_STATUS_LABEL[room.status]}
                  </span>
                </div>
                <strong className="ex1-room__name">{room.name}</strong>
                <span className="ex1-room__type">{room.type}</span>
                {room.guest ? (
                  <p className="ex1-room__guest">
                    {room.guest}
                    <span>{room.period}</span>
                  </p>
                ) : (
                  <p className="ex1-room__guest ex1-room__guest--empty">투숙객 없음</p>
                )}
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="ex1-grid ex1-grid--2">
        <article className="ex1-panel">
          <div className="ex1-panel__head">
            <div>
              <h2>오늘 일정</h2>
              <p>체크인 · 체크아웃</p>
            </div>
          </div>
          <ul className="ex1-schedule">
            {TODAY_SCHEDULE.map((item) => (
              <li key={item.id} className={`ex1-schedule__item ex1-schedule__item--${item.type}`}>
                <span className="ex1-schedule__type">{item.type === 'in' ? 'IN' : 'OUT'}</span>
                <div className="ex1-schedule__body">
                  <div className="ex1-schedule__row">
                    <strong>{item.time}</strong>
                    <span>{item.room}</span>
                  </div>
                  <p>{item.guest} · {item.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="ex1-panel ex1-panel--calendar">
          <Example1Calendar />
        </article>
      </section>

      <section className="ex1-panel ex1-panel--table">
        <div className="ex1-panel__head">
          <div>
            <h2>최근 예약</h2>
            <p>채널별 예약 내역</p>
          </div>
          <button type="button" className="ex1-btn ex1-btn--ghost ex1-btn--sm">
            전체 보기
          </button>
        </div>
        <div className="ex1-table-wrap">
          <table className="ex1-table">
            <thead>
              <tr>
                <th>예약번호</th>
                <th>투숙객</th>
                <th>객실</th>
                <th>박수</th>
                <th>금액</th>
                <th>채널</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {RESERVATIONS.slice(0, 5).map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.guest}</td>
                  <td>{row.room}</td>
                  <td>{row.nights}박</td>
                  <td>{row.amount}</td>
                  <td>{row.channel}</td>
                  <td>
                    <span className={`ex1-badge ex1-badge--${row.status}`}>
                      {RESERVATION_STATUS_LABEL[row.status]}
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
