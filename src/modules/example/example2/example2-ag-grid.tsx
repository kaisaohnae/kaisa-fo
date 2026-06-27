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
import {createCellRangeClassRules} from '../example1/cell-range-select';
import {useCellRangeSelect} from '../example1/use-cell-range-select';

const EX2_CELL_RANGE_CLASS_RULES = createCellRangeClassRules('ex2');

ModuleRegistry.registerModules([AllCommunityModule]);

const EX2_GRID_THEME = themeQuartz.withParams({
  accentColor: '#0096c7',
  backgroundColor: '#ffffff',
  borderColor: 'transparent',
  borderRadius: 10,
  cellHorizontalPadding: 16,
  chromeBackgroundColor: '#f4f9fc',
  fontSize: 13,
  headerBackgroundColor: '#edf6fb',
  headerFontSize: 12,
  headerFontWeight: 600,
  headerTextColor: '#5a7186',
  foregroundColor: '#0f2233',
  oddRowBackgroundColor: '#ffffff',
  rowHoverColor: 'transparent',
  selectedRowBackgroundColor: 'rgba(0, 150, 199, 0.08)',
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

export type Example2AgGridHandle = {
  getSelectedRows: () => unknown[];
  deselectAll: () => void;
};

type Example2AgGridProps<T> = {
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

function Example2AgGridInner<T>(
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
  }: Example2AgGridProps<T>,
  ref: React.Ref<Example2AgGridHandle>,
) {
  const gridRef = useRef<AgGridReact<T>>(null);
  const {gridContext, bindGridApi, onCellMouseDown, onCellMouseOver} = useCellRangeSelect(cellSelection);

  useImperativeHandle(ref, () => ({
    getSelectedRows: () => gridRef.current?.api?.getSelectedRows() ?? [],
    deselectAll: () => gridRef.current?.api?.deselectAll(),
  }));

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: false,
      filter: filterable,
      resizable: true,
      flex: 1,
      minWidth: 96,
      editable,
      suppressHeaderMenuButton: true,
      cellClassRules: cellSelection ? EX2_CELL_RANGE_CLASS_RULES : undefined,
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

  return (
    <div
      className={`ex2-ag-grid${cellSelection ? ' ex2-ag-grid--cell-select' : ''}${className ? ` ${className}` : ''}`}
      style={{width: '100%', height}}
    >
      <AgGridReact<T>
        ref={gridRef}
        theme={EX2_GRID_THEME}
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
        onCellMouseDown={cellSelection ? onCellMouseDown : undefined}
        onCellMouseOver={cellSelection ? onCellMouseOver : undefined}
      />
    </div>
  );
}

const Example2AgGrid = forwardRef(Example2AgGridInner) as <T>(
  props: Example2AgGridProps<T> & {ref?: React.Ref<Example2AgGridHandle>},
) => ReturnType<typeof Example2AgGridInner>;

export default Example2AgGrid;
