'use client';

import {useMemo, useState} from 'react';
import dynamic from 'next/dynamic';
import Example4Chips from './example4-chips';
import Example4PageHeader from './example4-page-header';
import {CATEGORY_FILTERS, SHIPPER_FILTERS, SHIPPER_SHARE} from './data';

const NivoShipperPie = dynamic(
  () => import('./charts/nivo-mix').then((mod) => mod.NivoShipperPie),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const NivoCategoryBar = dynamic(
  () => import('./charts/nivo-mix').then((mod) => mod.NivoCategoryBar),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const NivoShipperHeatmap = dynamic(
  () => import('./charts/nivo-mix').then((mod) => mod.NivoShipperHeatmap),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const NivoShipperRadar = dynamic(
  () => import('./charts/nivo-mix').then((mod) => mod.NivoShipperRadar),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const NivoShipperTreemap = dynamic(
  () => import('./charts/nivo-mix').then((mod) => mod.NivoShipperTreemap),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);
const NivoShipperLine = dynamic(
  () => import('./charts/nivo-mix').then((mod) => mod.NivoShipperLine),
  {ssr: false, loading: () => <div className="ex4-chart-fallback" />},
);

export default function Example4MixPage() {
  const [shipper, setShipper] = useState('all');
  const [category, setCategory] = useState('all');
  const rows = useMemo(
    () =>
      SHIPPER_SHARE.filter((row) => {
        const shipperOk = shipper === 'all' || row.id === shipper;
        const categoryOk = category === 'all' || row.category === category;
        return shipperOk && categoryOk;
      }),
    [category, shipper],
  );

  return (
    <>
      <Example4PageHeader
        title="화주 구성"
        description="이번 주 물동 비중. 한진철강이 여전히 1/3을 넘는다."
        library="Nivo"
      />

      <div className="ex4-toolbar">
        <Example4Chips label="화주" options={SHIPPER_FILTERS} value={shipper} onChange={setShipper} />
        <Example4Chips label="품목" options={CATEGORY_FILTERS} value={category} onChange={setCategory} />
      </div>

      <section className="ex4-split ex4-split--wide">
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>화주 비중</h2>
            <span>Pie</span>
          </div>
          <div className="ex4-chart-slot ex4-chart-slot--tall">
            <NivoShipperPie />
          </div>
        </article>

        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>품목별 톤</h2>
            <span>Bar</span>
          </div>
          <div className="ex4-chart-slot ex4-chart-slot--tall">
            <NivoCategoryBar />
          </div>
        </article>
      </section>

      <section className="ex4-split">
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>요일별 물동</h2>
            <span>Heatmap</span>
          </div>
          <div className="ex4-chart-slot ex4-chart-slot--tall">
            <NivoShipperHeatmap />
          </div>
        </article>
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>화주 지표</h2>
            <span>Radar</span>
          </div>
          <div className="ex4-chart-slot ex4-chart-slot--tall">
            <NivoShipperRadar />
          </div>
        </article>
      </section>

      <section className="ex4-split">
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>화주 면적</h2>
            <span>Treemap</span>
          </div>
          <div className="ex4-chart-slot ex4-chart-slot--tall">
            <NivoShipperTreemap />
          </div>
        </article>
        <article className="ex4-panel">
          <div className="ex4-panel__head">
            <h2>요일 추이</h2>
            <span>Line</span>
          </div>
          <div className="ex4-chart-slot ex4-chart-slot--tall">
            <NivoShipperLine />
          </div>
        </article>
      </section>

      <section className="ex4-panel" style={{marginTop: 12}}>
        <div className="ex4-panel__head">
          <h2>화주 메모</h2>
          <span>{rows.length}건</span>
        </div>
        <div className="ex4-table-wrap">
          {rows.length === 0 ? (
            <p className="ex4-empty">해당 조건의 화주가 없습니다.</p>
          ) : (
            <table className="ex4-table">
              <thead>
                <tr>
                  <th>화주</th>
                  <th>품목</th>
                  <th>비중</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.label}</td>
                    <td>{row.category}</td>
                    <td>{row.value}%</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
