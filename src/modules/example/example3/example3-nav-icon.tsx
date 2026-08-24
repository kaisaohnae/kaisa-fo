type Example3NavIconProps = {
  name: string;
  className?: string;
};

export default function Example3NavIcon({name, className}: Example3NavIconProps) {
  const props = {
    className,
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'overview':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'input':
      return (
        <svg {...props}>
          <rect x="3" y="7" width="18" height="10" rx="2" />
          <path d="M7 11h10" />
        </svg>
      );
    case 'select':
      return (
        <svg {...props}>
          <rect x="3" y="7" width="18" height="10" rx="2" />
          <path d="m10 12 2 2 4-4" />
        </svg>
      );
    case 'radio':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'checkbox':
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );
    case 'toggle':
      return (
        <svg {...props}>
          <rect x="3" y="8" width="18" height="8" rx="4" />
          <circle cx="16" cy="12" r="3" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'textarea':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 9h10M7 13h7" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...props}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M4 9h16M8 3v4M16 3v4" />
          <path d="M8 13h2M12 13h2M8 16h2" />
        </svg>
      );
    case 'datepicker':
      return (
        <svg {...props}>
          <rect x="3" y="7" width="18" height="12" rx="2" />
          <path d="M7 11h6" />
          <rect x="14" y="4" width="6" height="6" rx="1.5" />
          <path d="M16 6v2M15 7h2" />
        </svg>
      );
    case 'colorpicker':
      return (
        <svg {...props}>
          <path d="M12 3c-4.4 0-8 3.1-8 7.5 0 2.2 1.2 4.2 3 5.4.8.6 1.3 1.5 1.3 2.5v1.1c0 .6.4 1 1 1h7.4c.6 0 1-.4 1-1V18c0-1 .5-1.9 1.3-2.5 1.8-1.2 3-3.2 3-5.5C22 6.1 18.4 3 14 3h-2z" />
          <circle cx="8.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="8.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'button':
      return (
        <svg {...props}>
          <rect x="4" y="8" width="16" height="8" rx="4" />
        </svg>
      );
    case 'alert':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v5M12 16h.01" />
        </svg>
      );
    case 'loading':
      return (
        <svg {...props}>
          <path d="M12 3a9 9 0 1 0 9 9" />
        </svg>
      );
    case 'popup':
      return (
        <svg {...props}>
          <rect x="5" y="6" width="14" height="12" rx="2" />
          <path d="M8 10h8M8 13h5" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
