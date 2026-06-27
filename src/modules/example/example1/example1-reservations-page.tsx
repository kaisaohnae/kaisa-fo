'use client';

import type {ColDef} from 'ag-grid-community';
import {useMemo} from 'react';
import Example1AgGrid from './example1-ag-grid';
import Example1GridCrudBar from './example1-grid-crud-bar';
import Example1PageHeader from './example1-page-header';
import {
  createReservation,
  RESERVATIONS,
  RESERVATION_STATUS_LABEL,
  type Reservation,
} from './data';
import {getGridRowId, useGridCrud} from './use-grid-crud';

const STATUS_LABEL = RESERVATION_STATUS_LABEL;
const STATUS_VALUES = Object.keys(STATUS_LABEL);
const CHANNEL_VALUES = ['네이버', '야놀자', 'Airbnb', '직접 예약'];

export default function Example1ReservationsPage() {
  const {
    rows,
    gridRef,
    selectedCount,
    setSelectedCount,
    handleCellValueChanged,
    deleteSelected,
    prependRow,
  } = useGridCrud<Reservation>(RESERVATIONS);

  const columnDefs = useMemo<ColDef<Reservation>[]>(
    () => [
      {field: 'id', headerName: '예약번호', minWidth: 150, editable: false},
      {field: 'guest', headerName: '투숙객', minWidth: 100},
      {field: 'room', headerName: '객실', minWidth: 120},
      {field: 'checkIn', headerName: '체크인', minWidth: 110},
      {field: 'checkOut', headerName: '체크아웃', minWidth: 110},
      {field: 'nights', headerName: '박수', maxWidth: 80},
      {field: 'amount', headerName: '금액', minWidth: 100},
      {
        field: 'channel',
        headerName: '채널',
        minWidth: 100,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {values: CHANNEL_VALUES},
      },
      {
        field: 'status',
        headerName: '상태',
        minWidth: 100,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {values: STATUS_VALUES},
        valueFormatter: ({value}) => STATUS_LABEL[String(value)] ?? String(value),
      },
    ],
    [],
  );

  return (
    <>
      <Example1PageHeader
        title="예약 관리"
        description="예약 조회 · 상태 변경 · 채널별 필터"
        actions={
          <button type="button" className="ex1-btn ex1-btn--primary" onClick={() => prependRow(createReservation())}>
            + 신규 예약
          </button>
        }
      />
      <section className="ex1-panel ex1-panel--grid">
        <div className="ex1-panel__head">
          <div>
            <h2>예약 목록</h2>
            <p>셀 드래그 선택 · Ctrl+C Excel 붙여넣기 · 더블클릭 편집</p>
          </div>
        </div>
        <Example1GridCrudBar
          total={rows.length}
          selected={selectedCount}
          onAdd={() => prependRow(createReservation())}
          onDelete={deleteSelected}
          addLabel="+ 신규 예약"
        />
        <Example1AgGrid
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
