type Example4MeterProps = {
  label: string;
  actual: number;
  goal: number;
  unit: string;
  /** goal: 실적≥목표면 양호 / budget: 실적≤예산이면 양호 */
  mode?: 'goal' | 'budget';
};

export default function Example4Meter({
  label,
  actual,
  goal,
  unit,
  mode = 'goal',
}: Example4MeterProps) {
  const ratio = goal === 0 ? 0 : actual / goal;
  const pct = Math.min(100, Math.round(ratio * 100));
  const met = mode === 'budget' ? actual <= goal : actual >= goal;

  return (
    <div className="ex4-meter">
      <div className="ex4-meter__row">
        <span>{label}</span>
        <strong>
          {actual.toLocaleString('ko-KR')}
          {unit}
          <em>
            {' '}
            / {goal.toLocaleString('ko-KR')}
            {unit}
          </em>
        </strong>
      </div>
      <div className="ex4-meter__track">
        <span
          className={met ? 'ex4-meter__fill ex4-meter__fill--ok' : 'ex4-meter__fill'}
          style={{width: `${pct}%`}}
        />
      </div>
    </div>
  );
}
