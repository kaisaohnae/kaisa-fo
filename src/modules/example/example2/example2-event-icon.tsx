import type {LiveEventType} from './data';

type Example2EventIconProps = {
  type: LiveEventType;
  className?: string;
};

export default function Example2EventIcon({type, className}: Example2EventIconProps) {
  const props = {
    className,
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (type) {
    case 'start':
      return (
        <svg {...props}>
          <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
      );
    case 'end':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.5 2.5 2.5 4.5-5" />
        </svg>
      );
    case 'alert':
      return (
        <svg {...props}>
          <path d="M12 3 2.5 19h19L12 3z" />
          <path d="M12 9v5" />
          <path d="M12 17h.01" />
        </svg>
      );
  }
}
