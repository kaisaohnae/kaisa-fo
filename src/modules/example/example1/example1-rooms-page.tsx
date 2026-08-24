'use client';

import type {ColDef} from 'ag-grid-community';
import {useMemo} from 'react';
import Example1AgGrid from './example1-ag-grid';
import Example1GridCrudBar from './example1-grid-crud-bar';
import Example1PageHeader from './example1-page-header';
import {
  createRoomItem,
  ROOM_INVENTORY,
  ROOM_STATUS_LABEL,
  type RoomInventoryItem,
  type RoomStatus,
} from './data';
import {getGridRowId, useGridCrud} from './use-grid-crud';

const STATUS_VALUES = Object.keys(ROOM_STATUS_LABEL) as RoomStatus[];

const formatPrice = (value?: number) =>
  value != null ? value.toLocaleString('ko-KR') : '';

const parsePriceInput = (value: unknown) => {
  const num = Number(String(value ?? '').replace(/,/g, ''));
  return Number.isNaN(num) ? 0 : num;
};

export default function Example1RoomsPage() {
  const {
    rows,
    gridRef,
    selectedCount,
    setSelectedCount,
    handleCellValueChanged,
    deleteSelected,
    prependRow,
  } = useGridCrud<RoomInventoryItem>(ROOM_INVENTORY);

  const columnDefs = useMemo<ColDef<RoomInventoryItem>[]>(
    () => [
      {field: 'id', headerName: '객실', maxWidth: 80, editable: false},
      {field: 'name', headerName: '객실명', minWidth: 110},
      {field: 'type', headerName: '타입', minWidth: 130},
      {
        field: 'basePrice',
        headerName: '기본 요금',
        minWidth: 110,
        valueFormatter: ({value}) => formatPrice(value as number),
        valueParser: ({newValue}) => parsePriceInput(newValue),
      },
      {
        field: 'weekendPrice',
        headerName: '주말 요금',
        minWidth: 110,
        valueFormatter: ({value}) => formatPrice(value as number),
        valueParser: ({newValue}) => parsePriceInput(newValue),
      },
      {field: 'maxGuests', headerName: '최대 인원', maxWidth: 100},
      {
        field: 'status',
        headerName: '상태',
        minWidth: 100,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {values: STATUS_VALUES},
        valueFormatter: ({value}) => ROOM_STATUS_LABEL[value as RoomStatus] ?? String(value),
      },
    ],
    [],
  );

  return (
    <>
      <Example1PageHeader
        title="객실 현황"
        description="객실별 요금 · 상태 · 인원 설정"
        actions={
          <button type="button" className="ex1-btn ex1-btn--primary" onClick={() => prependRow(createRoomItem())}>
            + 객실 추가
          </button>
        }
      />
      <section className="ex1-panel ex1-panel--grid">
        <div className="ex1-panel__head">
          <div>
            <h2>객실 목록</h2>
            <p>요금 · 상태 인라인 편집 · 셀 드래그 · Ctrl+C 복사</p>
          </div>
        </div>
        <Example1GridCrudBar
          total={rows.length}
          selected={selectedCount}
          onAdd={() => prependRow(createRoomItem())}
          onDelete={deleteSelected}
          addLabel="+ 객실 추가"
        />
        <Example1AgGrid
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
