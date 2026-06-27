'use client';

import type {ColDef} from 'ag-grid-community';
import {useMemo} from 'react';
import Example2AgGrid from './example2-ag-grid';
import Example2GridCrudBar from './example2-grid-crud-bar';
import Example2PageHeader from './example2-page-header';
import {
  CHARGER_INVENTORY,
  CHARGER_STATUS_LABEL,
  createChargerItem,
  type ChargerItem,
  type ChargerStatus,
} from './data';
import {getGridRowId, useGridCrud} from '../example1/use-grid-crud';

const STATUS_VALUES = Object.keys(CHARGER_STATUS_LABEL) as ChargerStatus[];
const CONNECTOR_VALUES = ['CCS1', 'CCS2', 'CHAdeMO', 'AC'];

export default function Example2ChargersPage() {
  const {
    rows,
    gridRef,
    selectedCount,
    setSelectedCount,
    handleCellValueChanged,
    deleteSelected,
    prependRow,
  } = useGridCrud<ChargerItem>(CHARGER_INVENTORY);

  const columnDefs = useMemo<ColDef<ChargerItem>[]>(
    () => [
      {field: 'id', headerName: 'ID', maxWidth: 90, editable: false},
      {field: 'name', headerName: '충전기명', minWidth: 110},
      {field: 'type', headerName: '사양', minWidth: 130},
      {field: 'powerKw', headerName: '출력(kW)', maxWidth: 100},
      {
        field: 'connector',
        headerName: '커넥터',
        minWidth: 100,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {values: CONNECTOR_VALUES},
      },
      {
        field: 'unitPrice',
        headerName: '단가(원/kWh)',
        minWidth: 120,
        valueFormatter: ({value}) => (value as number)?.toLocaleString('ko-KR') ?? '',
        valueParser: ({newValue}) => Number(String(newValue).replace(/,/g, '')) || 0,
      },
      {
        field: 'status',
        headerName: '상태',
        minWidth: 100,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {values: STATUS_VALUES},
        valueFormatter: ({value}) => CHARGER_STATUS_LABEL[value as ChargerStatus] ?? String(value),
      },
    ],
    [],
  );

  return (
    <>
      <Example2PageHeader
        title="충전기 현황"
        description="출력 · 커넥터 · 단가 · 상태 관리"
        actions={
          <button type="button" className="ex2-btn ex2-btn--primary" onClick={() => prependRow(createChargerItem())}>
            + 충전기 추가
          </button>
        }
      />
      <section className="ex2-panel ex2-panel--grid">
        <div className="ex2-panel__head">
          <div>
            <h2>충전기 목록</h2>
            <p>초급속 · 급속 · 완속 인라인 편집</p>
          </div>
        </div>
        <Example2GridCrudBar
          total={rows.length}
          selected={selectedCount}
          onAdd={() => prependRow(createChargerItem())}
          onDelete={deleteSelected}
          addLabel="+ 충전기 추가"
        />
        <Example2AgGrid
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          height={520}
          editable
          selectable
          cellSelection
          getRowId={getGridRowId}
          onCellValueChanged={handleCellValueChanged}
          onSelectionChanged={setSelectedCount}
        />
      </section>
    </>
  );
}
