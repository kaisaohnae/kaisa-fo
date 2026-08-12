type Example4NavIconProps = {
  name: string;
  className?: string;
};

export default function Example4NavIcon({name, className}: Example4NavIconProps) {
  const props = {
    className,
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'overview':
      return (
        <svg {...props}>
          <path d="M4 19V10" />
          <path d="M10 19V5" />
          <path d="M16 19v-7" />
          <path d="M22 19H2" />
        </svg>
      );
    case 'sales':
      return (
        <svg {...props}>
          <path d="M3 17 9 11l4 4 8-9" />
          <path d="M14 6h7v7" />
        </svg>
      );
    case 'traffic':
      return (
        <svg {...props}>
          <rect x="3" y="10" width="4" height="10" rx="1" />
          <rect x="10" y="6" width="4" height="14" rx="1" />
          <rect x="17" y="13" width="4" height="7" rx="1" />
        </svg>
      );
    case 'mix':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4v8l6 3.5" />
        </svg>
      );
    case 'cost':
      return (
        <svg {...props}>
          <path d="M4 18c3-7 6-10 8-10s5 3 8 10" />
          <path d="M4 18h16" />
        </svg>
      );
    case 'tree':
      return (
        <svg {...props}>
          <path d="M6 5v14" />
          <path d="M6 8h7" />
          <path d="M6 12h4" />
          <path d="M10 12v7h8" />
          <path d="M6 19h4" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
  }
}
