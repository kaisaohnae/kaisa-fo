import {REVENUE_HISTORY} from './data';

const CHART_DEFAULT = {
  width: 960,
  height: 260,
  padLeft: 52,
  padRight: 16,
  padTop: 16,
  padBottom: 36,
};

const CHART_COMPACT = {
  width: 520,
  height: 220,
  padLeft: 44,
  padRight: 12,
  padTop: 12,
  padBottom: 32,
};

function formatAxisValue(value: number) {
  if (value >= 1000) {
    return `${Math.round(value / 100) / 10}천`;
  }
  return String(value);
}

function buildPaths(values: number[], maxValue: number, chart: typeof CHART_DEFAULT) {
  const plotWidth = chart.width - chart.padLeft - chart.padRight;
  const plotHeight = chart.height - chart.padTop - chart.padBottom;
  const step = values.length > 1 ? plotWidth / (values.length - 1) : 0;

  const points = values.map((value, index) => {
    const x = chart.padLeft + step * index;
    const y = chart.padTop + plotHeight - (value / maxValue) * plotHeight;
    return {x, y};
  });

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chart.padTop + plotHeight} L ${points[0].x} ${chart.padTop + plotHeight} Z`;

  return {points, linePath, areaPath, plotHeight};
}

type Example1RevenueChartProps = {
  compact?: boolean;
};

export default function Example1RevenueChart({compact = false}: Example1RevenueChartProps) {
  const chart = compact ? CHART_COMPACT : CHART_DEFAULT;
  const values = REVENUE_HISTORY.map((item) => item.value);
  const maxValue = Math.ceil(Math.max(...values) / 500) * 500;
  const yTicks = [0, maxValue * 0.33, maxValue * 0.66, maxValue].map((value) => Math.round(value));
  const {points, linePath, areaPath, plotHeight} = buildPaths(values, maxValue, chart);
  const plotBottom = chart.padTop + plotHeight;
  const labelStep = compact ? 4 : 3;

  return (
    <div className="ex1-revenue">
      <svg
        className="ex1-revenue__svg"
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        role="img"
        aria-label="지난 2년간 월별 매출 추이"
      >
        <defs>
          <linearGradient id="ex1-revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 77, 0, 0.28)" />
            <stop offset="100%" stopColor="rgba(255, 77, 0, 0.02)" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const y = plotBottom - (tick / maxValue) * plotHeight;
          return (
            <g key={tick}>
              <line
                className="ex1-revenue__grid"
                x1={chart.padLeft}
                y1={y}
                x2={chart.width - chart.padRight}
                y2={y}
              />
              <text className="ex1-revenue__axis-y" x={chart.padLeft - 8} y={y + 4} textAnchor="end">
                {formatAxisValue(tick)}
              </text>
            </g>
          );
        })}

        <path className="ex1-revenue__area" d={areaPath} />
        <path className="ex1-revenue__line" d={linePath} />

        {points.map((point, index) => {
          const item = REVENUE_HISTORY[index];
          const showLabel = index % labelStep === 0 || index === REVENUE_HISTORY.length - 1;

          return (
            <g key={item.label}>
              <circle className="ex1-revenue__dot" cx={point.x} cy={point.y} r={compact ? 3 : 4} />
              {showLabel ? (
                <text className="ex1-revenue__axis-x" x={point.x} y={chart.height - 8} textAnchor="middle">
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
