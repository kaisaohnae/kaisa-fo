'use client';

import {ResponsiveBar} from '@nivo/bar';
import {ResponsiveHeatMap} from '@nivo/heatmap';
import {ResponsiveLine} from '@nivo/line';
import {ResponsivePie} from '@nivo/pie';
import {ResponsiveRadar} from '@nivo/radar';
import {ResponsiveTreeMap} from '@nivo/treemap';
import {
  CATEGORY_VOLUME,
  CHART_COLORS,
  SHIPPER_HEATMAP,
  SHIPPER_LINE,
  SHIPPER_RADAR,
  SHIPPER_SHARE,
  SHIPPER_TREEMAP,
} from '../data';

const nivoTheme = {
  text: {fontSize: 12, fill: CHART_COLORS.text},
  axis: {
    ticks: {text: {fontSize: 11, fill: CHART_COLORS.text}},
    legend: {text: {fontSize: 11, fill: CHART_COLORS.text}},
  },
  grid: {line: {stroke: CHART_COLORS.grid}},
  tooltip: {
    container: {
      background: '#fffcf7',
      color: '#1c1b18',
      fontSize: 12,
      border: '1px solid #ddd8ce',
      borderRadius: 6,
      boxShadow: 'none',
    },
  },
};

const pieColors = [
  CHART_COLORS.ink,
  CHART_COLORS.brown,
  CHART_COLORS.slate,
  CHART_COLORS.sand,
  CHART_COLORS.steel,
];

export function NivoShipperPie() {
  return (
    <ResponsivePie
      data={SHIPPER_SHARE}
      theme={nivoTheme}
      colors={pieColors}
      margin={{top: 12, right: 88, bottom: 12, left: 12}}
      innerRadius={0.62}
      padAngle={1.2}
      cornerRadius={3}
      activeOuterRadiusOffset={4}
      enableArcLabels={false}
      enableArcLinkLabels={false}
      legends={[
        {
          anchor: 'right',
          direction: 'column',
          translateX: 72,
          itemWidth: 80,
          itemHeight: 18,
          symbolSize: 8,
          symbolShape: 'circle',
        },
      ]}
    />
  );
}

export function NivoCategoryBar() {
  return (
    <ResponsiveBar
      data={CATEGORY_VOLUME}
      theme={nivoTheme}
      keys={['volume']}
      indexBy="category"
      layout="horizontal"
      margin={{top: 8, right: 24, bottom: 8, left: 48}}
      padding={0.42}
      colors={[CHART_COLORS.ink]}
      borderRadius={3}
      enableGridY={false}
      enableLabel={false}
      axisBottom={null}
      axisLeft={{tickSize: 0, tickPadding: 8}}
      tooltip={({indexValue, value}) => (
        <strong style={{fontSize: 12, fontWeight: 600}}>
          {String(indexValue)} {Number(value).toLocaleString('ko-KR')}톤
        </strong>
      )}
    />
  );
}

export function NivoShipperHeatmap() {
  return (
    <ResponsiveHeatMap
      data={SHIPPER_HEATMAP}
      theme={nivoTheme}
      margin={{top: 28, right: 16, bottom: 28, left: 72}}
      axisTop={{tickSize: 0, tickPadding: 8}}
      axisLeft={{tickSize: 0, tickPadding: 8}}
      axisRight={null}
      colors={{
        type: 'sequential',
        colors: ['#efeae1', '#2c4a3e'],
      }}
      emptyColor="#f0ece4"
      borderWidth={2}
      borderColor="#fffcf7"
      enableLabels={false}
      hoverTarget="cell"
    />
  );
}

export function NivoShipperRadar() {
  return (
    <ResponsiveRadar
      data={SHIPPER_RADAR}
      theme={nivoTheme}
      keys={['한진철강', '동아전자', '남양식품']}
      indexBy="metric"
      maxValue={100}
      margin={{top: 28, right: 56, bottom: 48, left: 56}}
      borderWidth={2}
      colors={[CHART_COLORS.ink, CHART_COLORS.brown, CHART_COLORS.slate]}
      gridLabelOffset={12}
      dotSize={6}
      fillOpacity={0.18}
      blendMode="multiply"
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          translateY: 20,
          itemWidth: 78,
          itemHeight: 14,
          symbolSize: 8,
          symbolShape: 'circle',
        },
      ]}
    />
  );
}

export function NivoShipperTreemap() {
  return (
    <ResponsiveTreeMap
      data={SHIPPER_TREEMAP}
      theme={nivoTheme}
      identity="id"
      value="value"
      valueFormat={(value) => `${value}%`}
      colors={pieColors}
      margin={{top: 4, right: 4, bottom: 4, left: 4}}
      innerPadding={3}
      outerPadding={2}
      enableParentLabel={false}
      label="id"
      labelSkipSize={28}
      labelTextColor="#fffcf7"
      borderWidth={2}
      borderColor="#fffcf7"
    />
  );
}

export function NivoShipperLine() {
  return (
    <ResponsiveLine
      data={SHIPPER_LINE}
      theme={nivoTheme}
      margin={{top: 20, right: 88, bottom: 36, left: 36}}
      xScale={{type: 'point'}}
      yScale={{type: 'linear', min: 0, max: 70, stacked: false}}
      colors={[CHART_COLORS.ink, CHART_COLORS.brown, CHART_COLORS.slate]}
      axisBottom={{tickSize: 0, tickPadding: 8}}
      axisLeft={{tickSize: 0, tickPadding: 8}}
      enableGridX={false}
      pointSize={6}
      pointColor="#fffcf7"
      pointBorderWidth={2}
      pointBorderColor={{from: 'serieColor'}}
      useMesh
      legends={[
        {
          anchor: 'right',
          direction: 'column',
          translateX: 80,
          itemWidth: 72,
          itemHeight: 18,
          symbolSize: 8,
          symbolShape: 'circle',
        },
      ]}
    />
  );
}
