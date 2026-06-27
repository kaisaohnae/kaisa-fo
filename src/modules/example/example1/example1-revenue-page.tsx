'use client';

import type {ColDef} from 'ag-grid-community';
import {useMemo} from 'react';
import Example1AgGrid from './example1-ag-grid';
import Example1GridCrudBar from './example1-grid-crud-bar';
import Example1PageHeader from './example1-page-header';
import {REVENUE_REPORT_ROWS, REVENUE_SUMMARY} from './data';

const formatMoney = (value?: number) =>
  value != null ? value.toLocaleString('ko-KR') : '';

export default function Example1RevenuePage() {
  const columnDefs = useMemo<ColDef<(typeof REVENUE_REPORT_ROWS)[number]>[]>(
    () => [
      {field: 'month', headerName: '월', maxWidth: 100},
      {field: 'bookings', headerName: '예약 건수', maxWidth: 100},
      {field: 'nights', headerName: '판매 박수', maxWidth: 100},
      {
        field: 'revenue',
        headerName: '매출',
        minWidth: 120,
        valueFormatter: ({value}) => formatMoney(value as number),
      },
      {
        field: 'adr',
        headerName: '객단가(ADR)',
        minWidth: 120,
        valueFormatter: ({value}) => formatMoney(value as number),
      },
      {
        field: 'occupancy',
        headerName: '가동률',
        maxWidth: 90,
        valueFormatter: ({value}) => `${value}%`,
      },
    ],
    [],
  );

  return (
    <>
      <Example1PageHeader
        title="매출 리포트"
        description="월별 매출 · 객단가 · 가동률 분석"
        actions={
          <button type="button" className="ex1-btn ex1-btn--ghost">
            PDF 다운로드
          </button>
        }
      />
      <section className="ex1-stats ex1-stats--compact">
        <article className="ex1-stat ex1-stat--neutral">
          <span className="ex1-stat__label">올해 누적 매출</span>
          <strong className="ex1-stat__value">{REVENUE_SUMMARY.total}</strong>
          <span className="ex1-stat__note">전년 대비 {REVENUE_SUMMARY.growth}</span>
        </article>
        <article className="ex1-stat ex1-stat--success">
          <span className="ex1-stat__label">월 평균 매출</span>
          <strong className="ex1-stat__value">{REVENUE_SUMMARY.average}</strong>
          <span className="ex1-stat__note">최근 12개월 기준</span>
        </article>
        <article className="ex1-stat ex1-stat--accent">
          <span className="ex1-stat__label">6월 가동률</span>
          <strong className="ex1-stat__value">78%</strong>
          <span className="ex1-stat__note">목표 80%</span>
        </article>
        <article className="ex1-stat ex1-stat--info">
          <span className="ex1-stat__label">6월 ADR</span>
          <strong className="ex1-stat__value">325,455</strong>
          <span className="ex1-stat__note">전월 대비 +4.2%</span>
        </article>
      </section>

      <section className="ex1-panel ex1-panel--grid">
        <div className="ex1-panel__head">
          <div>
            <h2>월별 매출 상세</h2>
            <p>2025.07 — 2026.06</p>
          </div>
        </div>
        <Example1GridCrudBar
          total={REVENUE_REPORT_ROWS.length}
          selected={0}
          hint="셀 드래그로 범위 선택 · Ctrl+C → Excel 붙여넣기"
        />
        <Example1AgGrid
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
