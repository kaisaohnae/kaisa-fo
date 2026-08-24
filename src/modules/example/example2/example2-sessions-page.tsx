'use client';

import type {ColDef} from 'ag-grid-community';
import {useMemo} from 'react';
import Example2AgGrid from './example2-ag-grid';
import Example2GridCrudBar from './example2-grid-crud-bar';
import Example2PageHeader from './example2-page-header';
import {
  createSession,
  SESSIONS,
  SESSION_STATUS_LABEL,
  type Session,
} from './data';
import {getGridRowId, useGridCrud} from '../example1/use-grid-crud';

const STATUS_VALUES = Object.keys(SESSION_STATUS_LABEL);
const CONNECTOR_VALUES = ['CCS1', 'CCS2', 'CHAdeMO', 'AC'];

export default function Example2SessionsPage() {
  const {
    rows,
    gridRef,
    selectedCount,
    setSelectedCount,
    handleCellValueChanged,
    deleteSelected,
    prependRow,
  } = useGridCrud<Session>(SESSIONS);

  const columnDefs = useMemo<ColDef<Session>[]>(
    () => [
      {field: 'id', headerName: '세션 ID', minWidth: 150, editable: false},
      {field: 'member', headerName: '회원', minWidth: 100},
      {field: 'vehicle', headerName: '차량', minWidth: 110},
      {field: 'charger', headerName: '충전기', minWidth: 120},
      {field: 'startAt', headerName: '시작', minWidth: 140},
      {field: 'endAt', headerName: '종료', minWidth: 140},
      {field: 'kwh', headerName: 'kWh', maxWidth: 90},
      {field: 'amount', headerName: '금액', minWidth: 100},
      {
        field: 'connector',
        headerName: '커넥터',
        minWidth: 100,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {values: CONNECTOR_VALUES},
      },
      {
        field: 'status',
        headerName: '상태',
        minWidth: 100,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {values: STATUS_VALUES},
        valueFormatter: ({value}) => SESSION_STATUS_LABEL[String(value)] ?? String(value),
      },
    ],
    [],
  );

  return (
    <>
      <Example2PageHeader
        title="충전 이력"
        description="세션 조회 · kWh · 상태 관리"
        actions={
          <button type="button" className="ex2-btn ex2-btn--primary" onClick={() => prependRow(createSession())}>
            + 세션 등록
          </button>
        }
      />
      <section className="ex2-panel ex2-panel--grid">
        <div className="ex2-panel__head">
          <div>
            <h2>충전 세션</h2>
            <p>더블클릭 편집 · 셀 드래그 · Ctrl+C 복사</p>
          </div>
        </div>
        <Example2GridCrudBar
          total={rows.length}
          selected={selectedCount}
          onAdd={() => prependRow(createSession())}
          onDelete={deleteSelected}
          addLabel="+ 세션 등록"
        />
        <Example2AgGrid
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          height={580}
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
