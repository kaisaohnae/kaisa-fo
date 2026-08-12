'use client';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  PolarAreaController,
  RadialLinearScale,
  ScatterController,
  Tooltip,
} from 'chart.js';
import {Bar, Doughnut, Line, PolarArea, Radar, Scatter} from 'react-chartjs-2';
import {
  CHART_COLORS,
  DOCK_HOURS,
  DOCK_IN,
  DOCK_OUT,
  DOCK_SCATTER,
  DOCK_STATUS_SHARE,
  WEEKDAY_PEAK,
  WEEKLY_UTIL,
} from '../data';

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PolarAreaController,
  ScatterController,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

const tooltip = {
  backgroundColor: '#fffcf7',
  titleColor: '#1c1b18',
  bodyColor: '#1c1b18',
  borderColor: '#ddd8ce',
  borderWidth: 1,
};

const legend = {
  position: 'top' as const,
  align: 'end' as const,
  labels: {boxWidth: 10, boxHeight: 10, color: CHART_COLORS.text, font: {size: 12}},
};

export function ChartjsTrafficBar() {
  return (
    <Bar
      data={{
        labels: DOCK_HOURS.map((hour) => `${hour}시`),
        datasets: [
          {
            label: '입고',
            data: DOCK_IN,
            backgroundColor: CHART_COLORS.ink,
            borderRadius: 3,
            maxBarThickness: 18,
          },
          {
            label: '출고',
            data: DOCK_OUT,
            backgroundColor: CHART_COLORS.brown,
            borderRadius: 3,
            maxBarThickness: 18,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {legend, tooltip},
        scales: {
          x: {grid: {display: false}, ticks: {color: CHART_COLORS.text, font: {size: 11}}, border: {display: false}},
          y: {grid: {color: CHART_COLORS.grid}, ticks: {color: CHART_COLORS.text, font: {size: 11}}, border: {display: false}},
        },
      }}
    />
  );
}

export function ChartjsUtilLine() {
  return (
    <Line
      data={{
        labels: WEEKLY_UTIL.map((item) => item.day),
        datasets: [
          {
            label: '가동률',
            data: WEEKLY_UTIL.map((item) => item.rate),
            borderColor: CHART_COLORS.ink,
            backgroundColor: 'rgba(44, 74, 62, 0.12)',
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            borderWidth: 2,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {legend: {display: false}, tooltip},
        scales: {
          x: {grid: {display: false}, ticks: {color: CHART_COLORS.text, font: {size: 11}}, border: {display: false}},
          y: {
            min: 20,
            max: 100,
            grid: {color: CHART_COLORS.grid},
            ticks: {color: CHART_COLORS.text, font: {size: 11}, callback: (value) => `${value}%`},
            border: {display: false},
          },
        },
      }}
    />
  );
}

export function ChartjsStatusDoughnut() {
  return (
    <Doughnut
      data={{
        labels: DOCK_STATUS_SHARE.map((item) => item.label),
        datasets: [
          {
            data: DOCK_STATUS_SHARE.map((item) => item.value),
            backgroundColor: [CHART_COLORS.ink, CHART_COLORS.sand, CHART_COLORS.brown],
            borderWidth: 0,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {legend, tooltip},
      }}
    />
  );
}

export function ChartjsWeekdayRadar() {
  return (
    <Radar
      data={{
        labels: WEEKDAY_PEAK.labels,
        datasets: [
          {
            label: '입고',
            data: WEEKDAY_PEAK.inbound,
            borderColor: CHART_COLORS.ink,
            backgroundColor: 'rgba(44, 74, 62, 0.18)',
            pointBackgroundColor: CHART_COLORS.ink,
            borderWidth: 2,
          },
          {
            label: '출고',
            data: WEEKDAY_PEAK.outbound,
            borderColor: CHART_COLORS.brown,
            backgroundColor: 'rgba(139, 90, 43, 0.14)',
            pointBackgroundColor: CHART_COLORS.brown,
            borderWidth: 2,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {legend, tooltip},
        scales: {
          r: {
            min: 40,
            max: 100,
            ticks: {display: false},
            grid: {color: CHART_COLORS.grid},
            angleLines: {color: CHART_COLORS.grid},
            pointLabels: {color: CHART_COLORS.text, font: {size: 11}},
          },
        },
      }}
    />
  );
}

const polarColors = [
  'rgba(44, 74, 62, 0.78)',
  'rgba(139, 90, 43, 0.72)',
  'rgba(92, 107, 122, 0.7)',
  'rgba(163, 139, 109, 0.72)',
  'rgba(61, 90, 115, 0.7)',
  'rgba(44, 74, 62, 0.5)',
  'rgba(139, 90, 43, 0.5)',
  'rgba(92, 107, 122, 0.48)',
];

export function ChartjsDockPolar() {
  return (
    <PolarArea
      data={{
        labels: DOCK_SCATTER.map((dock) => dock.id),
        datasets: [
          {
            label: '가동률',
            data: DOCK_SCATTER.map((dock) => dock.util),
            backgroundColor: polarColors,
            borderWidth: 0,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {legend, tooltip},
        scales: {
          r: {
            ticks: {display: false},
            grid: {color: CHART_COLORS.grid},
            angleLines: {color: CHART_COLORS.grid},
          },
        },
      }}
    />
  );
}

export function ChartjsDockScatter() {
  return (
    <Scatter
      data={{
        datasets: [
          {
            label: '도크',
            data: DOCK_SCATTER.map((dock) => ({x: dock.trucks, y: dock.util})),
            backgroundColor: CHART_COLORS.ink,
            pointRadius: 7,
            pointHoverRadius: 9,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {display: false},
          tooltip: {
            ...tooltip,
            callbacks: {
              label: (ctx) => {
                const dock = DOCK_SCATTER[ctx.dataIndex];
                return `${dock.id} · ${dock.trucks}대 · ${dock.util}%`;
              },
            },
          },
        },
        scales: {
          x: {
            min: -1,
            max: 18,
            title: {display: true, text: '차량', color: CHART_COLORS.text, font: {size: 11}},
            grid: {color: CHART_COLORS.grid},
            ticks: {color: CHART_COLORS.text, font: {size: 11}},
            border: {display: false},
          },
          y: {
            min: 0,
            max: 100,
            title: {display: true, text: '가동률', color: CHART_COLORS.text, font: {size: 11}},
            grid: {color: CHART_COLORS.grid},
            ticks: {color: CHART_COLORS.text, font: {size: 11}, callback: (value) => `${value}%`},
            border: {display: false},
          },
        },
      }}
    />
  );
}
