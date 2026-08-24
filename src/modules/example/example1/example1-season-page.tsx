'use client';

import type {ColDef} from 'ag-grid-community';
import {useCallback, useMemo, useState} from 'react';
import Example1AgGrid from './example1-ag-grid';
import Example1GridCrudBar from './example1-grid-crud-bar';
import Example1PageHeader from './example1-page-header';
import {
  createSeasonDate,
  createSeasonRange,
  SEASON_GRADE_LABEL,
  SEASON_PERIOD_LABEL,
  SEASON_QUARTER_LABEL,
  SEASON_SETTINGS,
  type SeasonGrade,
  type SeasonQuarter,
  type SeasonSetting,
} from './season-data';
import {getGridRowId, useGridCrud} from './use-grid-crud';

type FilterGrade = SeasonGrade | 'all';

const formatPrice = (value?: number | null) =>
  value != null ? value.toLocaleString('ko-KR') : '';

const parsePriceInput = (value: unknown) => {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return null;
  const num = Number(trimmed.replace(/,/g, ''));
  return Number.isNaN(num) ? null : num;
};

const getRowYear = (row: SeasonSetting) => Number(row.startDate.slice(0, 4));

export default function Example1SeasonPage() {
  const {
    rows,
    gridRef,
    selectedCount,
    setSelectedCount,
    handleCellValueChanged,
    deleteSelected,
    prependRow,
  } = useGridCrud<SeasonSetting>(SEASON_SETTINGS);

  const [gradeFilter, setGradeFilter] = useState<FilterGrade>('all');
  const availableYears = useMemo(
    () => [...new Set(rows.map(getRowYear))].sort((a, b) => b - a),
    [rows],
  );
  const [yearFilter, setYearFilter] = useState(() => new Date().getFullYear());

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const gradeMatch = gradeFilter === 'all' || row.grade === gradeFilter;
        const yearMatch = getRowYear(row) === yearFilter;
        return gradeMatch && yearMatch;
      }),
    [gradeFilter, yearFilter, rows],
  );

  const handleSeasonCellChanged = useCallback(
    (event: Parameters<typeof handleCellValueChanged>[0]) => {
      if (event.data && event.colDef.field === 'rateMultiplier') {
        const multiplier = Number(event.data.rateMultiplier);
        if (!Number.isNaN(multiplier)) {
          event.data.price = Math.round(280000 * multiplier);
        }
      }
      handleCellValueChanged(event);
    },
    [handleCellValueChanged],
  );

  const columnDefs = useMemo<ColDef<SeasonSetting>[]>(
    () => [
      {field: 'name', headerName: '시즌명', minWidth: 140},
      {
        field: 'quarter',
        headerName: '계절',
        maxWidth: 80,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {values: Object.keys(SEASON_QUARTER_LABEL)},
        valueFormatter: ({value}) => SEASON_QUARTER_LABEL[value as SeasonQuarter],
      },
      {
        field: 'grade',
        headerName: '시즌 구분',
        minWidth: 100,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {values: Object.keys(SEASON_GRADE_LABEL)},
        valueFormatter: ({value}) => SEASON_GRADE_LABEL[value as SeasonGrade],
      },
      {
        field: 'periodType',
        headerName: '설정 유형',
        minWidth: 90,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {values: Object.keys(SEASON_PERIOD_LABEL)},
        valueFormatter: ({value}) => SEASON_PERIOD_LABEL[value as keyof typeof SEASON_PERIOD_LABEL],
      },
      {field: 'startDate', headerName: '시작일', minWidth: 110},
      {field: 'endDate', headerName: '종료일', minWidth: 110},
      {field: 'rateMultiplier', headerName: '요금 배율', maxWidth: 100},
      {
        field: 'price',
        headerName: '요금',
        minWidth: 110,
        editable: false,
        valueFormatter: ({data}) => formatPrice(data?.directPrice ?? data?.price),
        cellClassRules: {
          'ex1-grid-cell--priority': ({data}) => data?.directPrice != null,
        },
      },
      {
        field: 'directPrice',
        headerName: '직접 입력',
        minWidth: 120,
        cellClass: 'ex1-grid-cell--editable',
        valueFormatter: ({value}) => formatPrice(value as number | null),
        valueParser: ({newValue}) => parsePriceInput(newValue),
      },
      {field: 'rooms', headerName: '적용 객실', minWidth: 130},
      {
        field: 'status',
        headerName: '상태',
        maxWidth: 90,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {values: ['active', 'draft']},
        valueFormatter: ({value}) => (value === 'active' ? '적용 중' : '검토 중'),
      },
      {field: 'note', headerName: '메모', minWidth: 160},
    ],
    [],
  );

  return (
    <>
      <Example1PageHeader
        title="시즌 설정"
        description="연도별 · 비수기/성수기/극성수기 · 특정일 요금 관리"
        actions={
          <>
            <button type="button" className="ex1-btn ex1-btn--ghost" onClick={() => prependRow(createSeasonRange())}>
              기간 추가
            </button>
            <button type="button" className="ex1-btn ex1-btn--primary" onClick={() => prependRow(createSeasonDate())}>
              + 특정일 설정
            </button>
          </>
        }
      />
      <section className="ex1-panel ex1-panel--grid">
        <div className="ex1-panel__head">
          <div>
            <h2>시즌 요금표</h2>
            <p>직접 입력 값이 있으면 요금 배율보다 우선 적용됩니다</p>
          </div>
        </div>

        <div className="ex1-filters">
          <div className="ex1-filters__group">
            <span className="ex1-filters__label">년도</span>
            <div className="ex1-filters__chips">
              {availableYears.map((year) => (
                <button
                  key={year}
                  type="button"
                  className={
                    yearFilter === year ? 'ex1-filter-chip ex1-filter-chip--active' : 'ex1-filter-chip'
                  }
                  onClick={() => setYearFilter(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div className="ex1-filters__group">
            <span className="ex1-filters__label">시즌 구분</span>
            <div className="ex1-filters__chips">
              {(
                [
                  ['all', '전체'],
                  ['off', '비수기'],
                  ['peak', '성수기'],
                  ['super', '극성수기'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={
                    gradeFilter === value ? 'ex1-filter-chip ex1-filter-chip--active' : 'ex1-filter-chip'
                  }
                  onClick={() => setGradeFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Example1GridCrudBar
          total={filteredRows.length}
          selected={selectedCount}
          onAdd={() => prependRow(createSeasonRange())}
          onDelete={deleteSelected}
          addLabel="+ 기간 추가"
        />

        <Example1AgGrid
          ref={gridRef}
          rowData={filteredRows}
          columnDefs={columnDefs}
          height={560}
          editable
          selectable
          cellSelection
          getRowId={getGridRowId}
          onCellValueChanged={handleSeasonCellChanged}
          onSelectionChanged={setSelectedCount}
        />
      </section>
    </>
  );
}
