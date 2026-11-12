import { useState } from 'react'
import { COMMON_ALLERGIES, DIETS, NO_DIET } from '../data/options.js'
import ChipPicker from './ChipPicker.jsx'

// Diet + allergy pickers (FR-1). Used on the onboarding survey and the profile page.
export default function DietForm({ diets, allergies, onChange }) {
  const [custom, setCustom] = useState('')
  const allergyOptions = [...COMMON_ALLERGIES, ...allergies.filter((a) => !COMMON_ALLERGIES.includes(a))]

  function changeDiets(next) {
    // "none" and real diets can't both be on
    const justPickedNone = next.includes(NO_DIET) && !diets.includes(NO_DIET)
    if (justPickedNone) next = [NO_DIET]
    else next = next.filter((d) => d !== NO_DIET)
    onChange({ diets: next, allergies })
  }

  function addCustom(e) {
    e.preventDefault()
    const name = custom.trim()
    if (!name) return
    const pretty = name[0].toUpperCase() + name.slice(1)
    if (!allergies.some((a) => a.toLowerCase() === pretty.toLowerCase())) {
      onChange({ diets, allergies: [...allergies, pretty] })
    }
    setCustom('')
  }

  return (
    <>
      <section className="panel">
        <h2>
          Diet <span className="muted" style={{ fontWeight: 400, fontSize: 15 }}>(pick any)</span>
        </h2>
        <ChipPicker label="Diet" options={[...DIETS, NO_DIET]} value={diets} onChange={changeDiets} />
      </section>

      <section className="panel">
        <h2>Allergies</h2>
        <ChipPicker
          label="Allergies"
          color="red"
          options={allergyOptions}
          value={allergies}
          onChange={(next) => onChange({ diets, allergies: next })}
        />
        <div className="add-row">
          <label className="sr-only" htmlFor="custom-allergy">
            Other allergy
          </label>
          <input
            id="custom-allergy"
            className="input"
            placeholder="Something else? Type it here"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom(e)}
          />
          <button type="button" className="btn" onClick={addCustom}>
            Add
          </button>
        </div>
      </section>
    </>
  )
}
