// A row of toggle buttons.
// multiple: pick any number (value is an array) or just one (value is a string)
export default function ChipPicker({ options, value, onChange, multiple = true, color = '', label }) {
  const isOn = (option) => (multiple ? value.includes(option) : value === option)

  function toggle(option) {
    if (!multiple) {
      onChange(option)
    } else if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`chip ${color}`}
          aria-pressed={isOn(option)}
          onClick={() => toggle(option)}
        >
          {option}
          {color === 'red' && isOn(option) && (
            <span className="x" aria-hidden="true">
              ✕
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
