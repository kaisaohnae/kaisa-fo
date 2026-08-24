import type {CellValueChangedEvent, GetRowIdParams} from 'ag-grid-community';
import {useCallback, useRef, useState} from 'react';
import type {Example1AgGridHandle} from './example1-ag-grid';

export function getGridRowId<T extends {id: string}>(params: GetRowIdParams<T>) {
  return params.data.id;
}

export function useGridCrud<T extends {id: string}>(initialRows: T[]) {
  const [rows, setRows] = useState(initialRows);
  const [selectedCount, setSelectedCount] = useState(0);
  const gridRef = useRef<Example1AgGridHandle>(null);

  const handleCellValueChanged = useCallback((event: CellValueChangedEvent<T>) => {
    if (!event.data) return;
    setRows((prev) => prev.map((row) => (row.id === event.data!.id ? {...event.data!} : row)));
  }, []);

  const deleteSelected = useCallback(() => {
    const selected = (gridRef.current?.getSelectedRows() ?? []) as T[];
    if (selected.length === 0) return;
    const ids = new Set(selected.map((row) => row.id));
    setRows((prev) => prev.filter((row) => !ids.has(row.id)));
    gridRef.current?.deselectAll();
  }, []);

  const prependRow = useCallback((row: T) => {
    setRows((prev) => [row, ...prev]);
  }, []);

  return {
    rows,
    setRows,
    gridRef,
    selectedCount,
    setSelectedCount,
    handleCellValueChanged,
    deleteSelected,
    prependRow,
  };
}
