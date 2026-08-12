'use client';

import ReactECharts from 'echarts-for-react';
import {
  CHART_COLORS,
  DISPATCH_FUNNEL,
  DISPATCH_HEAT_DAYS,
  DISPATCH_HEAT_HOURS,
  DISPATCH_HEAT_VALUES,
  MONTHLY_SHIPPING,
  ROUTE_ROWS,
} from '../data';

const tooltipBase = {
  backgroundColor: '#fffcf7',
  borderColor: '#ddd8ce',
  textStyle: {color: '#1c1b18', fontSize: 12},
};

const palette = [CHART_COLORS.ink, CHART_COLORS.brown, CHART_COLORS.slate, CHART_COLORS.sand];

export function EchartsSalesCombo() {
  return (
    <ReactECharts
      option={{
        color: [CHART_COLORS.ink, CHART_COLORS.brown],
        grid: {top: 36, right: 48, left: 48, bottom: 28},
        legend: {
          top: 0,
          right: 0,
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {color: CHART_COLORS.text, fontSize: 12},
        },
        tooltip: {trigger: 'axis', ...tooltipBase},
        xAxis: {
          type: 'category',
          data: MONTHLY_SHIPPING.map((item) => item.month),
          axisTick: {show: false},
          axisLine: {lineStyle: {color: '#ddd8ce'}},
          axisLabel: {color: CHART_COLORS.text, fontSize: 11},
        },
        yAxis: [
          {
            type: 'value',
            name: '톤',
            splitLine: {lineStyle: {color: CHART_COLORS.grid}},
            axisLabel: {color: CHART_COLORS.text, fontSize: 11},
            nameTextStyle: {color: CHART_COLORS.text, fontSize: 11, padding: [0, 0, 0, 8]},
          },
          {
            type: 'value',
            name: '%',
            min: 88,
            max: 100,
            splitLine: {show: false},
            axisLabel: {color: CHART_COLORS.text, fontSize: 11},
            nameTextStyle: {color: CHART_COLORS.text, fontSize: 11},
          },
        ],
        series: [
          {
            name: '운송량',
            type: 'bar',
            barWidth: 22,
            data: MONTHLY_SHIPPING.map((item) => item.ton),
            itemStyle: {borderRadius: [3, 3, 0, 0]},
          },
          {
            name: '정시율',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            symbol: 'circle',
            symbolSize: 7,
            data: MONTHLY_SHIPPING.map((item) => item.ontime),
          },
        ],
      }}
      style={{height: '100%', width: '100%'}}
      notMerge
      lazyUpdate
    />
  );
}

export function EchartsRoutePie() {
  return (
    <ReactECharts
      option={{
        color: palette,
        tooltip: {trigger: 'item', ...tooltipBase},
        legend: {
          orient: 'vertical',
          right: 0,
          top: 'middle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {color: CHART_COLORS.text, fontSize: 11},
        },
        series: [
          {
            type: 'pie',
            radius: ['48%', '72%'],
            center: ['38%', '50%'],
            label: {show: false},
            data: ROUTE_ROWS.map((row) => ({name: row.route, value: row.ton})),
          },
        ],
      }}
      style={{height: '100%', width: '100%'}}
      notMerge
      lazyUpdate
    />
  );
}

export function EchartsDispatchFunnel() {
  return (
    <ReactECharts
      option={{
        color: [CHART_COLORS.ink],
        tooltip: {trigger: 'item', ...tooltipBase},
        series: [
          {
            type: 'funnel',
            left: '8%',
            width: '84%',
            top: 12,
            bottom: 12,
            minSize: '28%',
            gap: 6,
            label: {position: 'inside', color: '#1c1b18', fontSize: 12},
            itemStyle: {borderColor: '#fffcf7', borderWidth: 1},
            data: DISPATCH_FUNNEL.map((item, index) => ({
              ...item,
              itemStyle: {color: palette[index % palette.length]},
            })),
          },
        ],
      }}
      style={{height: '100%', width: '100%'}}
      notMerge
      lazyUpdate
    />
  );
}

export function EchartsRouteScatter() {
  return (
    <ReactECharts
      option={{
        color: [CHART_COLORS.ink],
        grid: {top: 28, right: 16, left: 44, bottom: 36},
        tooltip: {
          ...tooltipBase,
          formatter: (params: {data: [number, number, string]}) =>
            `${params.data[2]}<br/>${params.data[0]}톤 · 정시 ${params.data[1]}%`,
        },
        xAxis: {
          name: '톤',
          splitLine: {lineStyle: {color: CHART_COLORS.grid}},
          axisLabel: {color: CHART_COLORS.text, fontSize: 11},
          nameTextStyle: {color: CHART_COLORS.text, fontSize: 11},
        },
        yAxis: {
          name: '정시율',
          min: 90,
          max: 100,
          splitLine: {lineStyle: {color: CHART_COLORS.grid}},
          axisLabel: {color: CHART_COLORS.text, fontSize: 11, formatter: '{value}%'},
          nameTextStyle: {color: CHART_COLORS.text, fontSize: 11},
        },
        series: [
          {
            type: 'scatter',
            symbolSize: 16,
            data: ROUTE_ROWS.map((row) => [row.ton, row.ontime, row.route]),
          },
        ],
      }}
      style={{height: '100%', width: '100%'}}
      notMerge
      lazyUpdate
    />
  );
}

export function EchartsOntimeGauge() {
  const ontime = MONTHLY_SHIPPING[MONTHLY_SHIPPING.length - 1]?.ontime ?? 97;

  return (
    <ReactECharts
      option={{
        series: [
          {
            type: 'gauge',
            startAngle: 210,
            endAngle: -30,
            min: 80,
            max: 100,
            splitNumber: 4,
            axisLine: {
              lineStyle: {
                width: 12,
                color: [
                  [0.5, CHART_COLORS.sand],
                  [0.75, CHART_COLORS.brown],
                  [1, CHART_COLORS.ink],
                ],
              },
            },
            pointer: {width: 4, itemStyle: {color: CHART_COLORS.ink}},
            axisTick: {show: false},
            splitLine: {length: 8, lineStyle: {color: CHART_COLORS.grid, width: 1}},
            axisLabel: {color: CHART_COLORS.text, fontSize: 11, distance: 14},
            title: {offsetCenter: [0, '58%'], fontSize: 12, color: CHART_COLORS.text},
            detail: {
              formatter: '{value}%',
              fontSize: 22,
              fontWeight: 700,
              color: '#1c1b18',
              offsetCenter: [0, '28%'],
            },
            data: [{value: ontime, name: '8월 정시'}],
          },
        ],
      }}
      style={{height: '100%', width: '100%'}}
      notMerge
      lazyUpdate
    />
  );
}

export function EchartsDispatchHeatmap() {
  const heatData = DISPATCH_HEAT_DAYS.flatMap((_, dayIndex) =>
    DISPATCH_HEAT_HOURS.map((_, hourIndex) => [hourIndex, dayIndex, DISPATCH_HEAT_VALUES[dayIndex][hourIndex]]),
  );

  return (
    <ReactECharts
      option={{
        tooltip: {
          ...tooltipBase,
          formatter: (params: {data: [number, number, number]}) =>
            `${DISPATCH_HEAT_DAYS[params.data[1]]} ${DISPATCH_HEAT_HOURS[params.data[0]]}시 · ${params.data[2]}회`,
        },
        grid: {top: 8, right: 16, left: 36, bottom: 48},
        xAxis: {
          type: 'category',
          data: DISPATCH_HEAT_HOURS.map((hour) => `${hour}시`),
          splitArea: {show: true},
          axisTick: {show: false},
          axisLabel: {color: CHART_COLORS.text, fontSize: 11},
        },
        yAxis: {
          type: 'category',
          data: DISPATCH_HEAT_DAYS,
          splitArea: {show: true},
          axisTick: {show: false},
          axisLabel: {color: CHART_COLORS.text, fontSize: 11},
        },
        visualMap: {
          min: 0,
          max: 70,
          calculable: false,
          orient: 'horizontal',
          left: 'center',
          bottom: 0,
          itemHeight: 8,
          itemWidth: 140,
          inRange: {color: ['#efeae1', '#2c4a3e']},
          textStyle: {color: CHART_COLORS.text, fontSize: 11},
        },
        series: [
          {
            type: 'heatmap',
            data: heatData,
            label: {show: false},
            emphasis: {itemStyle: {shadowBlur: 6, shadowColor: 'rgba(28, 27, 24, 0.18)'}},
          },
        ],
      }}
      style={{height: '100%', width: '100%'}}
      notMerge
      lazyUpdate
    />
  );
}
