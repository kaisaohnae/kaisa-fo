'use client';

import type {ColDef} from 'ag-grid-community';
import {useCallback, useMemo, useState} from 'react';
import Example2AgGrid from './example2-ag-grid';
import Example2GridCrudBar from './example2-grid-crud-bar';
import Example2PageHeader from './example2-page-header';
import {
  createPricingRange,
  PRICING_PERIOD_LABEL,
  PRICING_RULES,
  PRICING_TIER_LABEL,
  type PricingRule,
  type PricingTier,
} from './pricing-data';
import {getGridRowId, useGridCrud} from '../example1/use-grid-crud';

const formatPrice = (value?: number | null) =>
  value != null ? value.toLocaleString('ko-KR') : '';

const parsePriceInput = (value: unknown) => {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return null;
  const num = Number(trimmed.replace(/,/g, ''));
  return Number.isNaN(num) ? null : num;
};

export default function Example2PricingPage() {
  const {
    rows,
    gridRef,
    selectedCount,
    setSelectedCount,
    handleCellValueChanged,
    deleteSelected,
    prependRow,
  } = useGridCrud<PricingRule>(PRICING_RULES);

  const [tierFilter, setTierFilter] = useState<PricingTier | 'all'>('all');

  const filteredRows = useMemo(
    () => rows.filter((row) => tierFilter === 'all' || row.tier === tierFilter),
    [rows, tierFilter],
  );

  const handlePricingCellChanged = useCallback(
    (event: Parameters<typeof handleCellValueChanged>[0]) => {
      if (event.data && event.colDef.field === 'multiplier') {
        const multiplier = Number(event.data.multiplier);
        if (!Number.isNaN(multiplier)) {
          event.data.price = Math.round(600 * multiplier);
        }
      }
      handleCellValueChanged(event);
    },
    [handleCellValueChanged],
  );

  const columnDefs = useMemo<ColDef<PricingRule>[]>(
    () => [
      {field: 'name', headerName: '요금명', minWidth: 130},
      {
        field: 'tier',
        headerName: '부하 구분',
        minWidth: 100,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {values: Object.keys(PRICING_TIER_LABEL)},
        valueFormatter: ({value}) => PRICING_TIER_LABEL[value as PricingTier],
      },
      {
        field: 'periodType',
        headerName: '유형',
        maxWidth: 90,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {values: Object.keys(PRICING_PERIOD_LABEL)},
        valueFormatter: ({value}) => PRICING_PERIOD_LABEL[value as keyof typeof PRICING_PERIOD_LABEL],
      },
      {field: 'startDate', headerName: '시작일', minWidth: 110},
      {field: 'endDate', headerName: '종료일', minWidth: 110},
      {field: 'multiplier', headerName: '배율', maxWidth: 80},
      {
        field: 'price',
        headerName: '요금(원/kWh)',
        minWidth: 120,
        editable: false,
        valueFormatter: ({data}) => formatPrice(data?.directPrice ?? data?.price),
      },
      {
        field: 'directPrice',
        headerName: '직접 입력',
        minWidth: 110,
        cellClass: 'ex2-grid-cell--editable',
        valueFormatter: ({value}) => formatPrice(value as number | null),
        valueParser: ({newValue}) => parsePriceInput(newValue),
      },
      {field: 'connectors', headerName: '적용', minWidth: 120},
      {
        field: 'status',
        headerName: '상태',
        maxWidth: 90,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {values: ['active', 'draft']},
        valueFormatter: ({value}) => (value === 'active' ? '적용중' : '검토중'),
      },
      {field: 'note', headerName: '메모', minWidth: 160},
    ],
    [],
  );

  return (
    <>
      <Example2PageHeader
        title="요금 설정"
        description="경부하 · 표준 · 피크 · 커넥터별 요금"
        actions={
          <button type="button" className="ex2-btn ex2-btn--primary" onClick={() => prependRow(createPricingRange())}>
            + 요금 추가
          </button>
        }
      />
      <section className="ex2-panel ex2-panel--grid">
        <div className="ex2-panel__head">
          <div>
            <h2>요금표</h2>
            <p>직접 입력 값이 배율보다 우선 적용</p>
          </div>
        </div>

        <div className="ex2-filters">
          <div className="ex2-filters__group">
            <span className="ex2-filters__label">부하 구분</span>
            <div className="ex2-filters__chips">
              {(
                [
                  ['all', '전체'],
                  ['offpeak', '경부하'],
                  ['standard', '표준'],
                  ['peak', '피크'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={
                    tierFilter === value ? 'ex2-filter-chip ex2-filter-chip--active' : 'ex2-filter-chip'
                  }
                  onClick={() => setTierFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Example2GridCrudBar
          total={filteredRows.length}
          selected={selectedCount}
          onAdd={() => prependRow(createPricingRange())}
          onDelete={deleteSelected}
          addLabel="+ 요금 추가"
        />
        <Example2AgGrid
          ref={gridRef}
          rowData={filteredRows}
          columnDefs={columnDefs}
          height={560}
          editable
          selectable
          cellSelection
          getRowId={getGridRowId}
          onCellValueChanged={handlePricingCellChanged}
          onSelectionChanged={setSelectedCount}
        />
      </section>
    </>
  );
}
