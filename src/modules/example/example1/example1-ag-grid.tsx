'use client';

import {AgGridReact} from 'ag-grid-react';
import {AllCommunityModule, ModuleRegistry, themeQuartz} from 'ag-grid-community';
import type {
  CellValueChangedEvent,
  ColDef,
  GetRowIdFunc,
  GridReadyEvent,
  RowSelectionOptions,
  SelectionChangedEvent,
} from 'ag-grid-community';
import {forwardRef, useImperativeHandle, useMemo, useRef} from 'react';
import {CELL_RANGE_CLASS_RULES} from './cell-range-select';
import {useCellRangeSelect} from './use-cell-range-select';

ModuleRegistry.registerModules([AllCommunityModule]);

const EX1_GRID_THEME = themeQuartz.withParams({
  accentColor: '#ff4d00',
  backgroundColor: '#ffffff',
  borderColor: 'transparent',
  borderRadius: 10,
  cellHorizontalPadding: 16,
  chromeBackgroundColor: '#faf9f7',
  fontSize: 13,
  headerBackgroundColor: '#f7f5f2',
  headerFontSize: 12,
  headerFontWeight: 600,
  headerTextColor: '#6f6a62',
  foregroundColor: '#171717',
  oddRowBackgroundColor: '#ffffff',
  rowHoverColor: 'transparent',
  selectedRowBackgroundColor: 'rgba(255, 77, 0, 0.07)',
  rowBorder: false,
  columnBorder: false,
  headerColumnBorder: false,
  spacing: 10,
  wrapperBorderRadius: 14,
});

const ROW_HEIGHT = 52;
const HEADER_HEIGHT = 46;

const ROW_SELECTION: RowSelectionOptions = {
  mode: 'multiRow',
  checkboxes: true,
  headerCheckbox: true,
  enableClickSelection: true,
};

export type Example1AgGridHandle = {
  getSelectedRows: () => unknown[];
  deselectAll: () => void;
};

type Example1AgGridProps<T> = {
  rowData: T[];
  columnDefs: ColDef<T>[];
  height?: number;
  className?: string;
  editable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  cellSelection?: boolean;
  getRowId?: GetRowIdFunc<T>;
  onCellValueChanged?: (event: CellValueChangedEvent<T>) => void;
  onSelectionChanged?: (count: number) => void;
};

function Example1AgGridInner<T>(
  {
    rowData,
    columnDefs,
    height = 480,
    className,
    editable = false,
    filterable = false,
    selectable = false,
    cellSelection = false,
    getRowId,
    onCellValueChanged,
    onSelectionChanged,
  }: Example1AgGridProps<T>,
  ref: React.Ref<Example1AgGridHandle>,
) {
  const gridRef = useRef<AgGridReact<T>>(null);
  const {gridContext, bindGridApi, onCellMouseDown, onCellMouseOver} = useCellRangeSelect(cellSelection);

  useImperativeHandle(ref, () => ({
    getSelectedRows: () => gridRef.current?.api?.getSelectedRows() ?? [],
    deselectAll: () => gridRef.current?.api?.deselectAll(),
  }));

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: filterable,
      resizable: true,
      flex: 1,
      minWidth: 96,
      editable,
      suppressHeaderMenuButton: true,
      cellClassRules: cellSelection ? CELL_RANGE_CLASS_RULES : undefined,
    }),
    [cellSelection, editable, filterable],
  );

  const handleSelectionChanged = (event: SelectionChangedEvent<T>) => {
    onSelectionChanged?.(event.api.getSelectedRows().length);
  };

  const handleGridReady = (event: GridReadyEvent<T>) => {
    bindGridApi(event.api);
    onSelectionChanged?.(event.api.getSelectedRows().length);
  };

  const handleCellMouseDown = (event: Parameters<NonNullable<typeof onCellMouseDown>>[0]) => {
    onCellMouseDown?.(event);
  };

  const handleCellMouseOver = (event: Parameters<NonNullable<typeof onCellMouseOver>>[0]) => {
    onCellMouseOver?.(event);
  };

  return (
    <div
      className={`ex1-ag-grid${cellSelection ? ' ex1-ag-grid--cell-select' : ''}${className ? ` ${className}` : ''}`}
      style={{width: '100%', height}}
    >
      <AgGridReact<T>
        ref={gridRef}
        theme={EX1_GRID_THEME}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        context={gridContext}
        getRowId={getRowId}
        rowHeight={ROW_HEIGHT}
        headerHeight={HEADER_HEIGHT}
        animateRows
        rowSelection={selectable ? ROW_SELECTION : undefined}
        enableCellTextSelection={!cellSelection}
        ensureDomOrder
        undoRedoCellEditing={editable}
        undoRedoCellEditingLimit={20}
        stopEditingWhenCellsLoseFocus
        singleClickEdit={false}
        onGridReady={handleGridReady}
        onSelectionChanged={handleSelectionChanged}
        onCellValueChanged={onCellValueChanged}
        onCellMouseDown={cellSelection ? handleCellMouseDown : undefined}
        onCellMouseOver={cellSelection ? handleCellMouseOver : undefined}
      />
    </div>
  );
}

const Example1AgGrid = forwardRef(Example1AgGridInner) as <T>(
  props: Example1AgGridProps<T> & {ref?: React.Ref<Example1AgGridHandle>},
) => ReturnType<typeof Example1AgGridInner>;

export default Example1AgGrid;
