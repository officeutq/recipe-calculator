import { useState } from "react"

type IngredientFormProps = {
  onAddIngredient: (ingredient: {
    name: string
    amount: number
    unit: string
  }) => void
}

function IngredientForm({ onAddIngredient }: IngredientFormProps) {
  const [newIngredientName, setNewIngredientName] = useState("")
  const [newIngredientAmount, setNewIngredientAmount] = useState("")
  const [newIngredientUnit, setNewIngredientUnit] = useState("")

  const handleSubmit = () => {
    const amountNumber = Number(newIngredientAmount)

    if (
      newIngredientName.trim() === "" ||
      newIngredientUnit.trim() === "" ||
      amountNumber <= 0
    ) {
      return
    }

    onAddIngredient({
      name: newIngredientName.trim(),
      amount: amountNumber,
      unit: newIngredientUnit.trim(),
    })

    setNewIngredientName("")
    setNewIngredientAmount("")
    setNewIngredientUnit("")
  }

  return (
    <div className="ingredient-form">
      <label className="field">
        <span>材料名</span>
        <input
          type="text"
          placeholder="例：卵"
          value={newIngredientName}
          onChange={(event) => setNewIngredientName(event.target.value)}
        />
      </label>

      <label className="field">
        <span>分量</span>
        <input
          type="number"
          min="0"
          step="0.1"
          placeholder="例：2"
          value={newIngredientAmount}
          onChange={(event) => setNewIngredientAmount(event.target.value)}
        />
      </label>

      <label className="field">
        <span>単位</span>
        <input
          type="text"
          placeholder="例：個"
          value={newIngredientUnit}
          onChange={(event) => setNewIngredientUnit(event.target.value)}
        />
      </label>

      <button type="button" onClick={handleSubmit}>
        材料を追加
      </button>
    </div>
  )
}

export default IngredientForm
