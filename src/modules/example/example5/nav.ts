export type NavItem = {
  id: string;
  label: string;
  href: string;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: '개요',
    href: '/example/example5',
    description: 'UI 컴포넌트 라이브러리 소개',
  },
  {
    id: 'input',
    label: 'Input',
    href: '/example/example5/input',
    description: 'size / disabled / readOnly / invalid',
  },
  {
    id: 'select',
    label: 'Select',
    href: '/example/example5/select',
    description: 'placeholder / 상태 / invalid',
  },
  {
    id: 'radio',
    label: 'Radio',
    href: '/example/example5/radio',
    description: 'group / description / disabled',
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    href: '/example/example5/checkbox',
    description: 'description / disabled / invalid',
  },
  {
    id: 'toggle',
    label: 'Toggle',
    href: '/example/example5/toggle',
    description: 'label / description / disabled',
  },
  {
    id: 'textarea',
    label: 'Textarea',
    href: '/example/example5/textarea',
    description: 'rows / resize / readOnly / invalid',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    href: '/example/example5/calendar',
    description: 'month nav / marked / min/max / state',
  },
  {
    id: 'datepicker',
    label: 'Datepicker',
    href: '/example/example5/datepicker',
    description: 'input / popover / clear / manual',
  },
  {
    id: 'colorpicker',
    label: 'Colorpicker',
    href: '/example/example5/colorpicker',
    description: 'hex / SV plane / hue / presets',
  },
  {
    id: 'button',
    label: 'Button',
    href: '/example/example5/button',
    description: 'variant / loading / danger / fullWidth',
  },
  {
    id: 'alert',
    label: 'Alert',
    href: '/example/example5/alert',
    description: 'confirm / cancel / long message',
  },
  {
    id: 'loading',
    label: 'Loading',
    href: '/example/example5/loading',
    description: '8 variants / local overlay',
  },
  {
    id: 'popup',
    label: 'Popup',
    href: '/example/example5/popup',
    description: 'title / confirm/cancel / backdrop lock',
  },
];

export function isNavActive(href: string, pathname: string) {
  if (href === '/example/example5') {
    return pathname === href || pathname === '/example/example5/';
  }
  return pathname.startsWith(href);
}
