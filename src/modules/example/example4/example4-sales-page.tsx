'use client';

import dynamic from 'next/dynamic';
import Example4Meter from './example4-meter';
import Example4PageHeader from './example4-page-header';
import {ROUTE_ROWS, SALES_COMPARE, SALES_GOALS} from './data';

const EchartsSalesCombo = dynamic(
  () => import('./charts/echarts-sales').then((mod) => mod.EchartsSalesCombo),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const EchartsRoutePie = dynamic(
  () => import('./charts/echarts-sales').then((mod) => mod.EchartsRoutePie),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const EchartsDispatchFunnel = dynamic(
  () => import('./charts/echarts-sales').then((mod) => mod.EchartsDispatchFunnel),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const EchartsRouteScatter = dynamic(
  () => import('./charts/echarts-sales').then((mod) => mod.EchartsRouteScatter),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const EchartsOntimeGauge = dynamic(
  () => import('./charts/echarts-sales').then((mod) => mod.EchartsOntimeGauge),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const EchartsDispatchHeatmap = dynamic(
  () => import('./charts/echarts-sales').then((mod) => mod.EchartsDispatchHeatmap),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);

export default function Example4SalesPage() {
  return (
    <>
      <Example4PageHeader
        title="운송 실적"
        description="월별 운송량과 정시율. 8월은 2주차까지 반영했다."
        library="ECharts"
      />

      <section className="ex4-stats">
        {SALES_COMPARE.map((item) => (
          <article key={item.label} className="ex4-stat">
            <div className="ex4-stat__top">
              <span className="ex4-stat__label">{item.label}</span>
              <span className={item.up ? 'ex4-delta ex4-delta--up' : 'ex4-delta ex4-delta--down'}>
                {item.delta}
              </span>
            </div>
            <strong className="ex4-stat__value">
              {item.value}
              <span className="ex4-stat__unit">{item.unit}</span>
            </strong>
            <span className="ex4-stat__note">{item.note}</span>
          </article>
        ))}
      </section>

      <section className="ex4-panel" style={{marginBottom: 12}}>
        <div className="ex4-panel__head">
          <h2>목표 대비</h2>
          <span>8월 2주</span>
        </div>
        <div className="ex4-meters">
          {SALES_GOALS.map((item) => (
            <Example4Meter
              key={item.label}
              label={item.label}
              actual={item.actual}
              goal={item.goal}
              unit={item.unit}
            />
          ))}
        </div>
      </section>

      <section className="ex4-panel">
        <div className="ex4-panel__head">
          <h2>월별 운송량 · 정시율</h2>
          <span>Bar + Line</span>
        </div>
        <div className="ex4-chart-slot ex4-chart-slot--tall">
          <EchartsSalesCombo />
        </div>
      </section>

      <section className="ex4-split--3">
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>노선 비중</h2>
            <span>Pie</span>
          </div>
          <div className="ex4-chart-slot">
            <EchartsRoutePie />
          </div>
        </article>
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>배차 흐름</h2>
            <span>Funnel</span>
          </div>
          <div className="ex4-chart-slot">
            <EchartsDispatchFunnel />
          </div>
        </article>
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>톤 vs 정시</h2>
            <span>Scatter</span>
          </div>
          <div className="ex4-chart-slot">
            <EchartsRouteScatter />
          </div>
        </article>
      </section>

      <section className="ex4-split">
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>정시율</h2>
            <span>Gauge</span>
          </div>
          <div className="ex4-chart-slot">
            <EchartsOntimeGauge />
          </div>
        </article>
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>요일·시간 배차</h2>
            <span>Heatmap</span>
          </div>
          <div className="ex4-chart-slot">
            <EchartsDispatchHeatmap />
          </div>
        </article>
      </section>

      <section className="ex4-panel" style={{marginTop: 12}}>
        <div className="ex4-panel__head">
          <h2>주요 노선</h2>
          <span>8월 2주</span>
        </div>
        <div className="ex4-table-wrap">
          <table className="ex4-table">
            <thead>
              <tr>
                <th>노선</th>
                <th>배차</th>
                <th>운송량</th>
                <th>정시율</th>
              </tr>
            </thead>
            <tbody>
              {ROUTE_ROWS.map((row) => (
                <tr key={row.route}>
                  <td>{row.route}</td>
                  <td>{row.trips}회</td>
                  <td>{row.ton}톤</td>
                  <td>{row.ontime}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
