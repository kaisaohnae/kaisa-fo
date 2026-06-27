import {CHANNEL_SHARE, ROOM_TYPE_REVENUE, STAY_NIGHTS} from './data';

const DONUT = {cx: 54, cy: 54, radius: 38, stroke: 12};

function describeDonutSegment(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = {
    x: cx + radius * Math.cos((Math.PI / 180) * (startAngle - 90)),
    y: cy + radius * Math.sin((Math.PI / 180) * (startAngle - 90)),
  };
  const end = {
    x: cx + radius * Math.cos((Math.PI / 180) * (endAngle - 90)),
    y: cy + radius * Math.sin((Math.PI / 180) * (endAngle - 90)),
  };
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function ChannelDonut() {
  let angle = 0;

  return (
    <div className="ex1-insights__donut">
      <svg viewBox="0 0 108 108" role="img" aria-label="예약 채널 비율">
        {CHANNEL_SHARE.map((item) => {
          const segmentAngle = (item.value / 100) * 360;
          const path = describeDonutSegment(DONUT.cx, DONUT.cy, DONUT.radius, angle, angle + segmentAngle);
          angle += segmentAngle;

          return (
            <path
              key={item.id}
              d={path}
              fill="none"
              stroke={item.color}
              strokeWidth={DONUT.stroke}
              strokeLinecap="butt"
            />
          );
        })}
        <text className="ex1-insights__donut-center" x={DONUT.cx} y={DONUT.cy - 2} textAnchor="middle">
          248건
        </text>
        <text className="ex1-insights__donut-sub" x={DONUT.cx} y={DONUT.cy + 12} textAnchor="middle">
          12개월
        </text>
      </svg>
      <ul className="ex1-insights__legend">
        {CHANNEL_SHARE.map((item) => (
          <li key={item.id}>
            <span className="ex1-insights__swatch" style={{background: item.color}} />
            <span>{item.label}</span>
            <strong>{item.value}%</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StayNightsChart() {
  const max = Math.max(...STAY_NIGHTS.map((item) => item.value));

  return (
    <div className="ex1-insights__bars ex1-insights__bars--vertical" role="img" aria-label="숙박 박수 분포">
      {STAY_NIGHTS.map((item) => (
        <div key={item.label} className="ex1-insights__bar-col">
          <span className="ex1-insights__bar-value">{item.value}%</span>
          <div className="ex1-insights__bar-track">
            <div className="ex1-insights__bar-fill" style={{height: `${(item.value / max) * 100}%`}} />
          </div>
          <span className="ex1-insights__bar-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function RoomTypeChart() {
  const max = Math.max(...ROOM_TYPE_REVENUE.map((item) => item.value));

  return (
    <div className="ex1-insights__bars ex1-insights__bars--horizontal" role="img" aria-label="객실 타입별 매출">
      {ROOM_TYPE_REVENUE.map((item) => (
        <div key={item.label} className="ex1-insights__bar-row">
          <span className="ex1-insights__bar-label">{item.label}</span>
          <div className="ex1-insights__bar-track">
            <div className="ex1-insights__bar-fill" style={{width: `${(item.value / max) * 100}%`}} />
          </div>
          <span className="ex1-insights__bar-value">{item.value.toLocaleString('ko-KR')}만</span>
        </div>
      ))}
    </div>
  );
}

export default function Example1InsightCharts() {
  return (
    <div className="ex1-insights">
      <div className="ex1-insights__row">
        <article className="ex1-mini-chart">
          <h3>예약 채널</h3>
          <p>최근 12개월 예약 비중</p>
          <ChannelDonut />
        </article>
        <article className="ex1-mini-chart">
          <h3>숙박 박수</h3>
          <p>예약 1건당 평균 2.1박</p>
          <StayNightsChart />
        </article>
      </div>
      <article className="ex1-mini-chart ex1-mini-chart--wide">
        <h3>객실 타입별 매출</h3>
        <p>최근 12개월 누적</p>
        <RoomTypeChart />
      </article>
    </div>
  );
}
