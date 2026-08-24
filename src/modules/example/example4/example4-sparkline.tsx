type Example4SparklineProps = {
  values: number[];
  up?: boolean;
};

export default function Example4Sparkline({values, up = true}: Example4SparklineProps) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const width = 72;
  const height = 28;
  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * width;
      const y = height - ((value - min) / span) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      className={up ? 'ex4-spark ex4-spark--up' : 'ex4-spark ex4-spark--down'}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <polyline fill="none" stroke="currentColor" strokeWidth="1.7" points={points} />
    </svg>
  );
}
