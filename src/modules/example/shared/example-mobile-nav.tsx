'use client';

export type ExampleShell = 'ex1' | 'ex2' | 'ex3';

type ExampleSidebarToggleProps = {
  shell: ExampleShell;
  open: boolean;
  onToggle: () => void;
  menuLabel?: string;
};

export function ExampleSidebarToggle({
  shell,
  open,
  onToggle,
  menuLabel = '메뉴',
}: ExampleSidebarToggleProps) {
  return (
    <button
      type="button"
      className={`${shell}-sidebar__toggle`}
      aria-label={open ? `${menuLabel} 닫기` : `${menuLabel} 열기`}
      aria-expanded={open}
      aria-controls={`${shell}-sidebar-nav`}
      onClick={onToggle}
    >
      <span className={`${shell}-sidebar__toggle-bar`} />
      <span className={`${shell}-sidebar__toggle-bar`} />
      <span className={`${shell}-sidebar__toggle-bar`} />
    </button>
  );
}
