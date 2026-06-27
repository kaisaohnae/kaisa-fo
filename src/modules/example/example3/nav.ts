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
    href: '/example/example3',
    description: 'UI 컴포넌트 라이브러리 소개',
  },
  {
    id: 'input',
    label: 'Input',
    href: '/example/example3/input',
    description: 'size · disabled · readOnly · invalid',
  },
  {
    id: 'select',
    label: 'Select',
    href: '/example/example3/select',
    description: 'placeholder · 상태 · invalid',
  },
  {
    id: 'radio',
    label: 'Radio',
    href: '/example/example3/radio',
    description: 'group · description · disabled',
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    href: '/example/example3/checkbox',
    description: 'description · disabled · invalid',
  },
  {
    id: 'toggle',
    label: 'Toggle',
    href: '/example/example3/toggle',
    description: 'label · description · disabled',
  },
  {
    id: 'textarea',
    label: 'Textarea',
    href: '/example/example3/textarea',
    description: 'rows · resize · readOnly · invalid',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    href: '/example/example3/calendar',
    description: 'month nav · marked · min/max · state',
  },
  {
    id: 'datepicker',
    label: 'Datepicker',
    href: '/example/example3/datepicker',
    description: 'input · popover · clear · manual',
  },
  {
    id: 'colorpicker',
    label: 'Colorpicker',
    href: '/example/example3/colorpicker',
    description: 'hex · SV plane · hue · presets',
  },
  {
    id: 'button',
    label: 'Button',
    href: '/example/example3/button',
    description: 'variant · loading · danger · fullWidth',
  },
  {
    id: 'alert',
    label: 'Alert',
    href: '/example/example3/alert',
    description: 'confirm · cancel · long message',
  },
  {
    id: 'loading',
    label: 'Loading',
    href: '/example/example3/loading',
    description: 'ring · dots · bars · pulse · overlay',
  },
  {
    id: 'popup',
    label: 'Popup',
    href: '/example/example3/popup',
    description: 'title · confirm/cancel · backdrop lock',
  },
];

export function isNavActive(href: string, pathname: string) {
  if (href === '/example/example3') {
    return pathname === href;
  }
  return pathname.startsWith(href);
}
