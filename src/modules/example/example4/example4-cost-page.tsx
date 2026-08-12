'use client';

import dynamic from 'next/dynamic';
import Example4Meter from './example4-meter';
import Example4PageHeader from './example4-page-header';
import {BUDGET_BARS, BUDGET_GAUGES} from './data';

const ApexCostArea = dynamic(
  () => import('./charts/apex-cost').then((mod) => mod.ApexCostArea),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const ApexCostBar = dynamic(
  () => import('./charts/apex-cost').then((mod) => mod.ApexCostBar),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const ApexCostDonut = dynamic(
  () => import('./charts/apex-cost').then((mod) => mod.ApexCostDonut),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const ApexBudgetGauge = dynamic(
  () => import('./charts/apex-cost').then((mod) => mod.ApexBudgetGauge),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const ApexCostHeatmap = dynamic(
  () => import('./charts/apex-cost').then((mod) => mod.ApexCostHeatmap),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const ApexCostRadar = dynamic(
  () => import('./charts/apex-cost').then((mod) => mod.ApexCostRadar),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);

export default function Example4CostPage() {
  return (
    <>
      <Example4PageHeader
        title="비용 추이"
        description="운임·인건·보관. 8월은 아직 반달치라 막대가 짧게 보인다."
        library="ApexCharts"
      />

      <section className="ex4-panel" style={{marginBottom: 12}}>
        <div className="ex4-panel__head">
          <h2>예산 소진</h2>
          <span>8월 · 백만원</span>
        </div>
        <div className="ex4-meters">
          {BUDGET_BARS.map((item) => (
            <Example4Meter
              key={item.label}
              label={item.label}
              actual={item.actual}
              goal={item.budget}
              unit={item.unit}
              mode="budget"
            />
          ))}
        </div>
      </section>

      <section className="ex4-stats">
        <article className="ex4-stat">
          <span className="ex4-stat__label">8월 누적</span>
          <strong className="ex4-stat__value">
            208
            <span className="ex4-stat__unit">백만</span>
          </strong>
          <span className="ex4-stat__note">월 예산 420백만</span>
        </article>
        <article className="ex4-stat">
          <span className="ex4-stat__label">운임 비중</span>
          <strong className="ex4-stat__value">
            55
            <span className="ex4-stat__unit">%</span>
          </strong>
          <span className="ex4-stat__note">용차 증가분 포함</span>
        </article>
        <article className="ex4-stat">
          <span className="ex4-stat__label">보관비</span>
          <strong className="ex4-stat__value">
            31
            <span className="ex4-stat__unit">백만</span>
          </strong>
          <span className="ex4-stat__note">인천 외주 창 포함</span>
        </article>
        <article className="ex4-stat">
          <span className="ex4-stat__label">예산 소진</span>
          <strong className="ex4-stat__value">
            50
            <span className="ex4-stat__unit">%</span>
          </strong>
          <span className="ex4-stat__note">2주차 기준</span>
        </article>
      </section>

      <section className="ex4-panel">
        <div className="ex4-panel__head">
          <h2>월별 비용</h2>
          <span>Area</span>
        </div>
        <div className="ex4-chart-slot ex4-chart-slot--tall">
          <ApexCostArea />
        </div>
      </section>

      <section className="ex4-split">
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>항목별 누적</h2>
            <span>Stacked Bar</span>
          </div>
          <div className="ex4-chart-slot">
            <ApexCostBar />
          </div>
        </article>
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>8월 구성</h2>
            <span>Donut</span>
          </div>
          <div className="ex4-chart-slot">
            <ApexCostDonut />
          </div>
        </article>
      </section>

      <section className="ex4-split">
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>월별 강도</h2>
            <span>Heatmap</span>
          </div>
          <div className="ex4-chart-slot">
            <ApexCostHeatmap />
          </div>
        </article>
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>항목 지수</h2>
            <span>Radar</span>
          </div>
          <div className="ex4-chart-slot">
            <ApexCostRadar />
          </div>
        </article>
      </section>

      <section className="ex4-radials">
        {BUDGET_GAUGES.map((item) => (
          <article key={item.label} className="ex4-panel ex4-radial">
            <div className="ex4-panel__head">
              <h2>{item.label} 예산</h2>
              <span>Radial</span>
            </div>
            <ApexBudgetGauge value={item.value} label={item.label} />
          </article>
        ))}
      </section>
    </>
  );
}
