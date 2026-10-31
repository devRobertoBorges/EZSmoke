interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterGroupProps<T extends string> {
  label: string;
  options: readonly FilterOption<T>[];
  selected: T | undefined;
  onChange: (value: T | undefined) => void;
}

export default function FilterGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
}: FilterGroupProps<T>) {
  return (
    <div className="filter-group" role="group" aria-label={label}>
      {options.map((option) => {
        const isActive = option.value === selected;

        return (
          <button
            key={option.value}
            type="button"
            className={isActive ? "chip chip--active" : "chip"}
            aria-pressed={isActive}
            // Clicou no ativo → remove o filtro. Clicou em outro → seleciona.
            onClick={() => onChange(isActive ? undefined : option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}