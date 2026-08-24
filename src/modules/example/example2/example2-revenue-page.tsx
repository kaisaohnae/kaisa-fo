'use client';

import type {ColDef} from 'ag-grid-community';
import {useMemo} from 'react';
import Example2AgGrid from './example2-ag-grid';
import Example2GridCrudBar from './example2-grid-crud-bar';
import Example2PageHeader from './example2-page-header';
import {REVENUE_REPORT_ROWS, REVENUE_SUMMARY} from './data';

const formatMoney = (value?: number) =>
  value != null ? value.toLocaleString('ko-KR') : '';

export default function Example2RevenuePage() {
  const columnDefs = useMemo<ColDef<(typeof REVENUE_REPORT_ROWS)[number]>[]>(
    () => [
      {field: 'month', headerName: '월', maxWidth: 100},
      {field: 'sessions', headerName: '세션', maxWidth: 90},
      {field: 'kwh', headerName: '충전량(kWh)', minWidth: 120, valueFormatter: ({value}) => formatMoney(value as number)},
      {
        field: 'revenue',
        headerName: '매출',
        minWidth: 120,
        valueFormatter: ({value}) => formatMoney(value as number),
      },
      {
        field: 'avgKwh',
        headerName: '세션당 kWh',
        maxWidth: 110,
      },
      {
        field: 'utilization',
        headerName: '가동률',
        maxWidth: 90,
        valueFormatter: ({value}) => `${value}%`,
      },
    ],
    [],
  );

  return (
    <>
      <Example2PageHeader
        title="매출 리포트"
        description="월별 충전량 · 매출 · 가동률"
        actions={
          <button type="button" className="ex2-btn ex2-btn--ghost">
            CSV 다운로드
          </button>
        }
      />
      <section className="ex2-stats ex2-stats--compact">
        <article className="ex2-stat ex2-stat--neutral">
          <span className="ex2-stat__label">올해 누적 매출</span>
          <strong className="ex2-stat__value">{REVENUE_SUMMARY.total}</strong>
          <span className="ex2-stat__note">전년 대비 {REVENUE_SUMMARY.growth}</span>
        </article>
        <article className="ex2-stat ex2-stat--success">
          <span className="ex2-stat__label">월 평균 매출</span>
          <strong className="ex2-stat__value">{REVENUE_SUMMARY.average}</strong>
          <span className="ex2-stat__note">최근 12개월</span>
        </article>
        <article className="ex2-stat ex2-stat--accent">
          <span className="ex2-stat__label">6월 가동률</span>
          <strong className="ex2-stat__value">68%</strong>
          <span className="ex2-stat__note">목표 70%</span>
        </article>
        <article className="ex2-stat ex2-stat--info">
          <span className="ex2-stat__label">6월 충전량</span>
          <strong className="ex2-stat__value">19,860</strong>
          <span className="ex2-stat__note">kWh · 전월 +2.5%</span>
        </article>
      </section>

      <section className="ex2-panel ex2-panel--grid">
        <div className="ex2-panel__head">
          <div>
            <h2>월별 상세</h2>
            <p>2025.07 — 2026.06</p>
          </div>
        </div>
        <Example2GridCrudBar
          total={REVENUE_REPORT_ROWS.length}
          selected={0}
          hint="셀 드래그 · Ctrl+C → Excel 붙여넣기"
        />
        <Example2AgGrid
          rowData={REVENUE_REPORT_ROWS}
          columnDefs={columnDefs}
          height={560}
          filterable
          cellSelection
        />
      </section>
    </>
  );
}
