import { useEffect, useState } from "react"
import type { Recipe } from "../types/ingredient"

type RecipeFormValues = {
  name: string
  description: string
  baseAmount: string
}

type RecipeFormProps = {
  title: string
  initialRecipe?: Recipe
  onSave: (values: RecipeFormValues) => void
  onCancel: () => void
}

function RecipeForm({ title, initialRecipe, onSave, onCancel }: RecipeFormProps) {
  const [name, setName] = useState(initialRecipe?.name ?? "")
  const [description, setDescription] = useState(initialRecipe?.description ?? "")
  const [baseAmount, setBaseAmount] = useState(
    initialRecipe ? String(initialRecipe.baseAmount) : "",
  )

  useEffect(() => {
    setName(initialRecipe?.name ?? "")
    setDescription(initialRecipe?.description ?? "")
    setBaseAmount(initialRecipe ? String(initialRecipe.baseAmount) : "")
  }, [initialRecipe])

  return (
    <section className="recipe-card" aria-labelledby="recipe-form-screen-title">
      <h2 id="recipe-form-screen-title">{title}</h2>

      <div className="form-grid">
        <label className="field">
          <input
            type="text"
            placeholder="レシピ名"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className="field">
          <input
            type="text"
            placeholder="説明"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <label className="field">
          <input
            type="number"
            min="1"
            placeholder="基準量"
            value={baseAmount}
            onChange={(event) => setBaseAmount(event.target.value)}
          />
        </label>
      </div>

      <div className="recipe-action-buttons form-actions">
        <button
          type="button"
          onClick={() => onSave({ name, description, baseAmount })}
        >
          保存
        </button>
        <button type="button" onClick={onCancel}>キャンセル</button>
      </div>
    </section>
  )
}

export default RecipeForm
