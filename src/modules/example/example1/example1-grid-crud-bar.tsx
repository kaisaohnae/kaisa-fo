'use client';

type Example1GridCrudBarProps = {
  total: number;
  selected: number;
  hint?: string;
  onAdd?: () => void;
  onDelete?: () => void;
  addLabel?: string;
  deleteLabel?: string;
};

export default function Example1GridCrudBar({
  total,
  selected,
  hint = '셀 드래그로 범위 선택 · Ctrl+C로 Excel 붙여넣기 · 더블클릭 편집',
  onAdd,
  onDelete,
  addLabel = '+ 행 추가',
  deleteLabel = '선택 삭제',
}: Example1GridCrudBarProps) {
  return (
    <div className="ex1-grid-crud">
      <div className="ex1-grid-crud__meta">
        <span className="ex1-grid-crud__count">총 {total}건</span>
        <span className="ex1-grid-crud__selected">{selected}건 선택</span>
        <span className="ex1-grid-crud__hint">{hint}</span>
      </div>
      {(onAdd || onDelete) && (
        <div className="ex1-grid-crud__actions">
          {onAdd ? (
            <button type="button" className="ex1-btn ex1-btn--ghost ex1-btn--sm" onClick={onAdd}>
              {addLabel}
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              className="ex1-btn ex1-btn--ghost ex1-btn--sm ex1-btn--danger"
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
