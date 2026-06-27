'use client';

type Example2GridCrudBarProps = {
  total: number;
  selected: number;
  hint?: string;
  onAdd?: () => void;
  onDelete?: () => void;
  addLabel?: string;
  deleteLabel?: string;
};

export default function Example2GridCrudBar({
  total,
  selected,
  hint = '셀 드래그로 범위 선택 · Ctrl+C로 Excel 붙여넣기 · 더블클릭 편집',
  onAdd,
  onDelete,
  addLabel = '+ 행 추가',
  deleteLabel = '선택 삭제',
}: Example2GridCrudBarProps) {
  return (
    <div className="ex2-grid-crud">
      <div className="ex2-grid-crud__meta">
        <span className="ex2-grid-crud__count">총 {total}건</span>
        <span className="ex2-grid-crud__selected">{selected}건 선택</span>
        <span className="ex2-grid-crud__hint">{hint}</span>
      </div>
      {(onAdd || onDelete) && (
        <div className="ex2-grid-crud__actions">
          {onAdd ? (
            <button type="button" className="ex2-btn ex2-btn--ghost ex2-btn--sm" onClick={onAdd}>
              {addLabel}
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              className="ex2-btn ex2-btn--ghost ex2-btn--sm ex2-btn--danger"
              onClick={onDelete}
              disabled={selected === 0}
            >
              {deleteLabel}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
