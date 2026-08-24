'use client';

import Chart from 'react-apexcharts';
import type {ApexOptions} from 'apexcharts';
import {BUDGET_GAUGES, CHART_COLORS, COST_DONUT, COST_MONTHS, COST_RADAR, COST_SERIES} from '../data';

const baseChart: ApexOptions['chart'] = {
  toolbar: {show: false},
  zoom: {enabled: false},
  fontFamily: 'inherit',
  background: 'transparent',
};

const axisLabel = {style: {colors: CHART_COLORS.text, fontSize: '11px'}};

export function ApexCostArea() {
  const options: ApexOptions = {
    chart: baseChart,
    colors: [CHART_COLORS.ink, CHART_COLORS.brown, CHART_COLORS.slate, CHART_COLORS.sand],
    dataLabels: {enabled: false},
    stroke: {curve: 'smooth', width: 2},
    fill: {type: 'solid', opacity: 0.22},
    legend: {position: 'top', horizontalAlign: 'right', fontSize: '12px', labels: {colors: CHART_COLORS.text}},
    grid: {borderColor: CHART_COLORS.grid, strokeDashArray: 0},
    xaxis: {
      categories: COST_MONTHS,
      axisBorder: {show: false},
      axisTicks: {show: false},
      labels: axisLabel,
    },
    yaxis: {
      labels: {
        ...axisLabel,
        formatter: (value) => `${Math.round(value)}`,
      },
    },
    tooltip: {theme: 'light', y: {formatter: (value) => `${value}백만`}},
  };

  return (
    <Chart
      type="area"
      height="100%"
      options={options}
      series={[
        {name: '운임', data: COST_SERIES.freight},
        {name: '인건', data: COST_SERIES.labor},
        {name: '보관', data: COST_SERIES.storage},
        {name: '기타', data: COST_SERIES.other},
      ]}
    />
  );
}

export function ApexCostBar() {
  const options: ApexOptions = {
    chart: {...baseChart, stacked: true},
    colors: [CHART_COLORS.ink, CHART_COLORS.brown, CHART_COLORS.slate, CHART_COLORS.sand],
    dataLabels: {enabled: false},
    plotOptions: {bar: {columnWidth: '46%', borderRadius: 3}},
    legend: {position: 'top', horizontalAlign: 'right', fontSize: '12px', labels: {colors: CHART_COLORS.text}},
    grid: {borderColor: CHART_COLORS.grid, strokeDashArray: 0},
    xaxis: {
      categories: COST_MONTHS,
      axisBorder: {show: false},
      axisTicks: {show: false},
      labels: axisLabel,
    },
    yaxis: {labels: axisLabel},
    tooltip: {theme: 'light', y: {formatter: (value) => `${value}백만`}},
  };

  return (
    <Chart
      type="bar"
      height="100%"
      options={options}
      series={[
        {name: '운임', data: COST_SERIES.freight},
        {name: '인건', data: COST_SERIES.labor},
        {name: '보관', data: COST_SERIES.storage},
        {name: '기타', data: COST_SERIES.other},
      ]}
    />
  );
}

export function ApexCostDonut() {
  const options: ApexOptions = {
    chart: baseChart,
    labels: COST_DONUT.map((item) => item.label),
    colors: [CHART_COLORS.ink, CHART_COLORS.brown, CHART_COLORS.slate, CHART_COLORS.sand],
    dataLabels: {enabled: false},
    legend: {position: 'right', fontSize: '12px', labels: {colors: CHART_COLORS.text}},
    stroke: {width: 0},
    plotOptions: {
      pie: {
        donut: {
          size: '64%',
          labels: {
            show: true,
            total: {show: true, label: '8월', fontSize: '12px', color: CHART_COLORS.text},
          },
        },
      },
    },
    tooltip: {theme: 'light', y: {formatter: (value) => `${value}백만`}},
  };

  return <Chart type="donut" height="100%" options={options} series={COST_DONUT.map((item) => item.value)} />;
}

export function ApexBudgetGauge({value, label}: {value: number; label: string}) {
  const options: ApexOptions = {
    chart: {toolbar: {show: false}, sparkline: {enabled: true}, fontFamily: 'inherit'},
    colors: [CHART_COLORS.ink],
    plotOptions: {
      radialBar: {
        hollow: {size: '58%'},
        track: {background: '#e8e4db'},
        dataLabels: {
          name: {show: true, fontSize: '12px', color: CHART_COLORS.text, offsetY: 18},
          value: {
            show: true,
            fontSize: '20px',
            fontWeight: 700,
            color: '#1c1b18',
            offsetY: -8,
            formatter: () => `${value}%`,
          },
        },
      },
    },
    labels: [label],
  };

  return <Chart type="radialBar" height={180} options={options} series={[value]} />;
}

export function ApexCostHeatmap() {
  const options: ApexOptions = {
    chart: baseChart,
    dataLabels: {enabled: false},
    colors: [CHART_COLORS.ink],
    legend: {show: false},
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.45,
        radius: 2,
        colorScale: {
          ranges: [
            {from: 0, to: 40, color: '#efeae1', name: '낮음'},
            {from: 41, to: 100, color: '#a38b6d', name: '중간'},
            {from: 101, to: 250, color: '#2c4a3e', name: '높음'},
          ],
        },
      },
    },
    xaxis: {
      categories: COST_MONTHS,
      axisBorder: {show: false},
      axisTicks: {show: false},
      labels: axisLabel,
    },
    yaxis: {labels: axisLabel},
    tooltip: {theme: 'light', y: {formatter: (value) => `${value}백만`}},
  };

  return (
    <Chart
      type="heatmap"
      height="100%"
      options={options}
      series={[
        {name: '운임', data: COST_SERIES.freight},
        {name: '인건', data: COST_SERIES.labor},
        {name: '보관', data: COST_SERIES.storage},
        {name: '기타', data: COST_SERIES.other},
      ]}
    />
  );
}

export function ApexCostRadar() {
  const options: ApexOptions = {
    chart: baseChart,
    colors: [CHART_COLORS.slate, CHART_COLORS.brown, CHART_COLORS.ink],
    stroke: {width: 2},
    fill: {opacity: 0.18},
    markers: {size: 4},
    legend: {position: 'top', horizontalAlign: 'right', fontSize: '12px', labels: {colors: CHART_COLORS.text}},
    xaxis: {categories: COST_RADAR.labels},
    yaxis: {show: false, max: 100},
    tooltip: {theme: 'light'},
  };

  return <Chart type="radar" height="100%" options={options} series={COST_RADAR.series} />;
}
