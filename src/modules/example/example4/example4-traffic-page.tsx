'use client';

import dynamic from 'next/dynamic';
import Example4PageHeader from './example4-page-header';
import Example4Yard from './example4-yard';
import {DOCK_STATUS_LABEL, DOCKS} from './data';

const ChartjsTrafficBar = dynamic(
  () => import('./charts/chartjs-traffic').then((mod) => mod.ChartjsTrafficBar),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const ChartjsUtilLine = dynamic(
  () => import('./charts/chartjs-traffic').then((mod) => mod.ChartjsUtilLine),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const ChartjsStatusDoughnut = dynamic(
  () => import('./charts/chartjs-traffic').then((mod) => mod.ChartjsStatusDoughnut),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const ChartjsWeekdayRadar = dynamic(
  () => import('./charts/chartjs-traffic').then((mod) => mod.ChartjsWeekdayRadar),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const ChartjsDockPolar = dynamic(
  () => import('./charts/chartjs-traffic').then((mod) => mod.ChartjsDockPolar),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const ChartjsDockScatter = dynamic(
  () => import('./charts/chartjs-traffic').then((mod) => mod.ChartjsDockScatter),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);

export default function Example4TrafficPage() {
  return (
    <>
      <Example4PageHeader
        title="도크 가동"
        description="시간대별 입출고 건수와 도크 8면 상태. 야간 배차는 20시 이후 집계하지 않는다."
        library="Chart.js"
      />

      <section className="ex4-panel" style={{marginBottom: 12}}>
        <div className="ex4-panel__head">
          <h2>인천센터 평면도</h2>
          <span>08면</span>
        </div>
        <Example4Yard />
      </section>

      <section className="ex4-panel">
        <div className="ex4-panel__head">
          <h2>시간대별 입출고</h2>
          <span>Bar</span>
        </div>
        <div className="ex4-chart-slot ex4-chart-slot--tall">
          <ChartjsTrafficBar />
        </div>
      </section>

      <section className="ex4-split--3">
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>주간 가동률</h2>
            <span>Line</span>
          </div>
          <div className="ex4-chart-slot">
            <ChartjsUtilLine />
          </div>
        </article>
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>도크 상태</h2>
            <span>Doughnut</span>
          </div>
          <div className="ex4-chart-slot">
            <ChartjsStatusDoughnut />
          </div>
        </article>
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>요일 피크</h2>
            <span>Radar</span>
          </div>
          <div className="ex4-chart-slot">
            <ChartjsWeekdayRadar />
          </div>
        </article>
      </section>

      <section className="ex4-split">
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>도크별 가동</h2>
            <span>Polar Area</span>
          </div>
          <div className="ex4-chart-slot">
            <ChartjsDockPolar />
          </div>
        </article>
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>차량 vs 가동</h2>
            <span>Scatter</span>
          </div>
          <div className="ex4-chart-slot">
            <ChartjsDockScatter />
          </div>
        </article>
      </section>

      <section className="ex4-panel" style={{marginTop: 12}}>
        <div className="ex4-panel__head">
          <h2>도크 현황</h2>
          <span>08면</span>
        </div>
        <div className="ex4-docks">
          {DOCKS.map((dock) => (
            <article key={dock.id} className="ex4-dock">
              <div className="ex4-dock__top">
                <span className="ex4-dock__id">{dock.id}</span>
                <span className={`ex4-pill ex4-pill--${dock.status}`}>{DOCK_STATUS_LABEL[dock.status]}</span>
              </div>
              <p className="ex4-dock__note">{dock.note}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
