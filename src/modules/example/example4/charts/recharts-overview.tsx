'use client';

import type {MouseEventHandler} from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from 'recharts';
import {
  CENTER_RADAR,
  CENTER_STOCK,
  CHART_COLORS,
  DELAY_REASONS,
  INBOUND_OUTBOUND,
  OCCUPANCY_TREND,
  STOCK_TREEMAP,
} from '../data';

const tooltipStyle = {
  background: '#fffcf7',
  border: '1px solid #ddd8ce',
  borderRadius: 6,
  fontSize: 12,
};

const pieColors = [CHART_COLORS.ink, CHART_COLORS.brown, CHART_COLORS.slate, CHART_COLORS.sand];

export function InOutTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={INBOUND_OUTBOUND} margin={{top: 8, right: 8, left: -12, bottom: 0}}>
        <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis dataKey="day" tick={{fontSize: 11, fill: CHART_COLORS.text}} axisLine={false} tickLine={false} />
        <YAxis tick={{fontSize: 11, fill: CHART_COLORS.text}} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{fontSize: 12}} />
        <Line type="monotone" dataKey="in" name="입고" stroke={CHART_COLORS.ink} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="out" name="출고" stroke={CHART_COLORS.brown} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CenterStockChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={CENTER_STOCK} margin={{top: 8, right: 8, left: -12, bottom: 0}}>
        <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis dataKey="center" tick={{fontSize: 11, fill: CHART_COLORS.text}} axisLine={false} tickLine={false} />
        <YAxis tick={{fontSize: 11, fill: CHART_COLORS.text}} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number) => [`${value.toLocaleString('ko-KR')} PLT`, '잔여']}
        />
        <Bar dataKey="stock" name="잔여" fill={CHART_COLORS.ink} radius={[3, 3, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function OccupancyAreaChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={OCCUPANCY_TREND} margin={{top: 8, right: 8, left: -12, bottom: 0}}>
        <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis dataKey="day" tick={{fontSize: 11, fill: CHART_COLORS.text}} axisLine={false} tickLine={false} />
        <YAxis
          domain={[40, 100]}
          tick={{fontSize: 11, fill: CHART_COLORS.text}}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, '점유']} />
        <Area
          type="monotone"
          dataKey="rate"
          name="점유율"
          stroke={CHART_COLORS.ink}
          fill={CHART_COLORS.ink}
          fillOpacity={0.16}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DelayReasonPieChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: string) => [`${value}건`, name]} />
        <Legend iconType="circle" wrapperStyle={{fontSize: 12}} />
        <Pie
          data={DELAY_REASONS}
          dataKey="value"
          nameKey="name"
          cx="46%"
          cy="50%"
          innerRadius={48}
          outerRadius={78}
          paddingAngle={2}
        >
          {DELAY_REASONS.map((item, index) => (
            <Cell key={item.name} fill={pieColors[index % pieColors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CenterRadarChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={CENTER_RADAR} cx="50%" cy="50%" outerRadius="72%">
        <PolarGrid stroke={CHART_COLORS.grid} />
        <PolarAngleAxis dataKey="metric" tick={{fontSize: 11, fill: CHART_COLORS.text}} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{fontSize: 12}} />
        <Radar name="인천" dataKey="인천" stroke={CHART_COLORS.ink} fill={CHART_COLORS.ink} fillOpacity={0.22} />
        <Radar name="평택" dataKey="평택" stroke={CHART_COLORS.brown} fill={CHART_COLORS.brown} fillOpacity={0.12} />
        <Radar name="광주" dataKey="광주" stroke={CHART_COLORS.slate} fill={CHART_COLORS.slate} fillOpacity={0.1} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

const treeColors = [
  CHART_COLORS.ink,
  CHART_COLORS.brown,
  CHART_COLORS.slate,
  CHART_COLORS.sand,
  CHART_COLORS.steel,
  CHART_COLORS.ink,
  CHART_COLORS.brown,
];

function TreemapCell(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  index?: number;
  onMouseEnter?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  onClick?: MouseEventHandler;
}) {
  const {x = 0, y = 0, width = 0, height = 0, name, index = 0, onMouseEnter, onMouseLeave, onClick} = props;
  if (width < 2 || height < 2) return null;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={treeColors[index % treeColors.length]}
        stroke="#fffcf7"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      />
      {width > 52 && height > 28 ? (
        <text x={x + 8} y={y + 20} fill="#fffcf7" fontSize={11}>
          {name}
        </text>
      ) : null}
    </g>
  );
}

export function StockTreemapChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={STOCK_TREEMAP}
        dataKey="size"
        nameKey="name"
        stroke="#fffcf7"
        fill={CHART_COLORS.ink}
        isAnimationActive={false}
        content={<TreemapCell />}
      >
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number) => [`${value.toLocaleString('ko-KR')} PLT`, '잔여']}
        />
      </Treemap>
    </ResponsiveContainer>
  );
}
