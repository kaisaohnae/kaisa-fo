'use client';

import {useMemo, useState} from 'react';
import dynamic from 'next/dynamic';
import Example4Chips from './example4-chips';
import Example4Issues from './example4-issues';
import Example4PageHeader from './example4-page-header';
import Example4Sparkline from './example4-sparkline';
import {
  CENTER_OPTIONS,
  DELAY_ROWS,
  OVERVIEW_BY_PERIOD,
  PERIOD_OPTIONS,
  type CenterId,
  type PeriodId,
} from './data';

const InOutTrendChart = dynamic(
  () => import('./charts/recharts-overview').then((mod) => mod.InOutTrendChart),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const CenterStockChart = dynamic(
  () => import('./charts/recharts-overview').then((mod) => mod.CenterStockChart),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const OccupancyAreaChart = dynamic(
  () => import('./charts/recharts-overview').then((mod) => mod.OccupancyAreaChart),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const DelayReasonPieChart = dynamic(
  () => import('./charts/recharts-overview').then((mod) => mod.DelayReasonPieChart),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const CenterRadarChart = dynamic(
  () => import('./charts/recharts-overview').then((mod) => mod.CenterRadarChart),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const StockTreemapChart = dynamic(
  () => import('./charts/recharts-overview').then((mod) => mod.StockTreemapChart),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);

export default function Example4OverviewPage() {
  const [period, setPeriod] = useState<PeriodId>('today');
  const [center, setCenter] = useState<CenterId>('incheon');
  const snapshot = OVERVIEW_BY_PERIOD[period];
  const stats = useMemo(
    () =>
      snapshot.stats.map((stat) =>
        center === 'all' && stat.id !== 'delay'
          ? {...stat, value: stat.id === 'stock' ? '18,480' : stat.value}
          : stat,
      ),
    [center, snapshot.stats],
  );

  return (
    <>
      <Example4PageHeader
        title="운영 현황"
        description="인천센터 입출고와 잔여 팔레트. 주말 물량은 빼 두고 평일 기준으로 본다."
        library="Recharts"
        period={snapshot.kicker}
      />

      <div className="ex4-toolbar">
        <Example4Chips
          label="기간"
          options={PERIOD_OPTIONS}
          value={period}
          onChange={(id) => setPeriod(id as PeriodId)}
        />
        <Example4Chips
          label="센터"
          options={CENTER_OPTIONS}
          value={center}
          onChange={(id) => setCenter(id as CenterId)}
        />
      </div>

      <Example4Issues />

      <section className="ex4-stats">
        {stats.map((stat) => (
          <article key={stat.id} className="ex4-stat">
            <div className="ex4-stat__top">
              <span className="ex4-stat__label">{stat.label}</span>
              <span className={stat.up ? 'ex4-delta ex4-delta--up' : 'ex4-delta ex4-delta--down'}>
                {stat.delta}
              </span>
            </div>
            <strong className="ex4-stat__value">
              {stat.value}
              <span className="ex4-stat__unit">{stat.unit}</span>
            </strong>
            <Example4Sparkline values={stat.spark} up={stat.up} />
          </article>
        ))}
      </section>

      <section className="ex4-split">
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>입출고 추이</h2>
            <span>Line</span>
          </div>
          <div className="ex4-chart-slot">
            <InOutTrendChart />
          </div>
        </article>

        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>센터별 잔여</h2>
            <span>Bar</span>
          </div>
          <div className="ex4-chart-slot">
            <CenterStockChart />
          </div>
        </article>
      </section>

      <section className="ex4-split">
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>창고 점유율</h2>
            <span>Area</span>
          </div>
          <div className="ex4-chart-slot">
            <OccupancyAreaChart />
          </div>
        </article>

        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>지연 사유</h2>
            <span>Pie</span>
          </div>
          <div className="ex4-chart-slot">
            <DelayReasonPieChart />
          </div>
        </article>
      </section>

      <section className="ex4-split">
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>센터 지표</h2>
            <span>Radar</span>
          </div>
          <div className="ex4-chart-slot">
            <CenterRadarChart />
          </div>
        </article>
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>재고 구성</h2>
            <span>Treemap</span>
          </div>
          <div className="ex4-chart-slot">
            <StockTreemapChart />
          </div>
        </article>
      </section>

      <section className="ex4-panel" style={{marginTop: 12}}>
        <div className="ex4-panel__head">
          <h2>지연 건</h2>
          <span>9건 중 최근 3건</span>
        </div>
        <ul className="ex4-list">
          {DELAY_ROWS.map((row) => (
            <li key={row.id} className="ex4-list__item">
              <span className="ex4-list__id">{row.id}</span>
              <p className="ex4-list__route">
                <strong>{row.route}</strong>
                <span>{row.reason}</span>
              </p>
              <span>{row.eta}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
