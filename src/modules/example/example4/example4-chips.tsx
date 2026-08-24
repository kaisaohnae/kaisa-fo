type ChipOption = {id: string; label: string};

type Example4ChipsProps = {
  label?: string;
  options: readonly ChipOption[];
  value: string;
  onChange: (id: string) => void;
};

export default function Example4Chips({label, options, value, onChange}: Example4ChipsProps) {
  return (
    <div className="ex4-chips">
      {label ? <span className="ex4-chips__label">{label}</span> : null}
      <div className="ex4-chips__list">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={value === option.id ? 'ex4-chip ex4-chip--on' : 'ex4-chip'}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
