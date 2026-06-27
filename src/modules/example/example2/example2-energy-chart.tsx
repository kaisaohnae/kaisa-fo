import {ENERGY_HISTORY} from './data';

type Example2EnergyChartProps = {
  compact?: boolean;
};

export default function Example2EnergyChart({compact = false}: Example2EnergyChartProps) {
  const data = compact ? ENERGY_HISTORY.slice(-8) : ENERGY_HISTORY;
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="ex2-energy__bar-wrap">
      {data.map((item) => (
        <div key={item.label} className="ex2-energy__col">
          <span className="ex2-energy__value">{Math.round(item.value / 100) / 10}MWh</span>
          <div className="ex2-energy__bar-track">
            <div
              className="ex2-energy__bar-fill"
              style={{height: `${Math.max(12, (item.value / maxValue) * 100)}%`}}
            />
          </div>
          <span className="ex2-energy__label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
