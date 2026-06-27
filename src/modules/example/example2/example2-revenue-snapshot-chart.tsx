import {REVENUE_REPORT_ROWS} from './data';

const CHART = {
  width: 520,
  height: 220,
  padLeft: 44,
  padRight: 12,
  padTop: 12,
  padBottom: 32,
};

function formatAxisValue(value: number) {
  if (value >= 10000000) {
    return `${Math.round(value / 1000000) / 10}천`;
  }
  if (value >= 10000) {
    return `${Math.round(value / 10000)}만`;
  }
  return String(value);
}

function buildPaths(values: number[], maxValue: number) {
  const plotWidth = CHART.width - CHART.padLeft - CHART.padRight;
  const plotHeight = CHART.height - CHART.padTop - CHART.padBottom;
  const step = values.length > 1 ? plotWidth / (values.length - 1) : 0;

  const points = values.map((value, index) => {
    const x = CHART.padLeft + step * index;
    const y = CHART.padTop + plotHeight - (value / maxValue) * plotHeight;
    return {x, y};
  });

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${CHART.padTop + plotHeight} L ${points[0].x} ${CHART.padTop + plotHeight} Z`;

  return {points, linePath, areaPath, plotHeight};
}

export default function Example2RevenueSnapshotChart() {
  const history = REVENUE_REPORT_ROWS.map((row) => ({
    label: `${Number(row.month.slice(5))}월`,
    value: row.revenue,
  }));
  const values = history.map((item) => item.value);
  const maxValue = Math.ceil(Math.max(...values) / 2000000) * 2000000;
  const yTicks = [0, maxValue * 0.33, maxValue * 0.66, maxValue].map((value) => Math.round(value));
  const {points, linePath, areaPath, plotHeight} = buildPaths(values, maxValue);
  const plotBottom = CHART.padTop + plotHeight;

  return (
    <div className="ex2-revenue">
      <svg
        className="ex2-revenue__svg"
        viewBox={`0 0 ${CHART.width} ${CHART.height}`}
        role="img"
        aria-label="최근 12개월 매출 추이"
      >
        <defs>
          <linearGradient id="ex2-revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0, 150, 199, 0.28)" />
            <stop offset="100%" stopColor="rgba(0, 150, 199, 0.02)" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const y = plotBottom - (tick / maxValue) * plotHeight;
          return (
            <g key={tick}>
              <line
                className="ex2-revenue__grid"
                x1={CHART.padLeft}
                y1={y}
                x2={CHART.width - CHART.padRight}
                y2={y}
              />
              <text className="ex2-revenue__axis-y" x={CHART.padLeft - 8} y={y + 4} textAnchor="end">
                {formatAxisValue(tick)}
              </text>
            </g>
          );
        })}

        <path className="ex2-revenue__area" d={areaPath} />
        <path className="ex2-revenue__line" d={linePath} />

        {points.map((point, index) => {
          const item = history[index];
          const showLabel = index % 4 === 0 || index === history.length - 1;

          return (
            <g key={item.label}>
              <circle className="ex2-revenue__dot" cx={point.x} cy={point.y} r={3} />
              {showLabel ? (
                <text className="ex2-revenue__axis-x" x={point.x} y={CHART.height - 8} textAnchor="middle">
                  {item.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
