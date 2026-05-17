import { useEffect, useState } from "react"
import type { Ingredient, Recipe } from "../types/ingredient"

export type RecipeFormValues = {
  name: string
  description: string
  baseAmount: string
  ingredients: Ingredient[]
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
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialRecipe?.ingredients ?? [],
  )
  const [ingredientName, setIngredientName] = useState("")
  const [ingredientAmount, setIngredientAmount] = useState("")
  const [ingredientUnit, setIngredientUnit] = useState("")

  useEffect(() => {
    setName(initialRecipe?.name ?? "")
    setDescription(initialRecipe?.description ?? "")
    setBaseAmount(initialRecipe ? String(initialRecipe.baseAmount) : "")
    setIngredients(initialRecipe?.ingredients ?? [])
  }, [initialRecipe])

  const handleAddIngredient = () => {
    const trimmedName = ingredientName.trim()
    const amount = Number(ingredientAmount)
    const trimmedUnit = ingredientUnit.trim()

    if (trimmedName === "") {
      alert("材料名を入力してください")
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("分量は0より大きい値を入力してください")
      return
    }

    if (trimmedUnit === "") {
      alert("単位を入力してください")
      return
    }

    setIngredients((prevIngredients) => [
      ...prevIngredients,
      { id: Date.now(), name: trimmedName, amount, unit: trimmedUnit },
    ])
    setIngredientName("")
    setIngredientAmount("")
    setIngredientUnit("")
  }

  const handleRemoveIngredient = (ingredientId: number) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== ingredientId),
    )
  }

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

      <div className="ingredients-section">
        <div className="section-header">
          <h2>材料</h2>
        </div>

        <div className="form-grid ingredient-editor-grid">
          <label className="field">
            <input
              type="text"
              placeholder="材料名"
              value={ingredientName}
              onChange={(event) => setIngredientName(event.target.value)}
            />
          </label>

          <label className="field">
            <input
              type="number"
              min="0"
              placeholder="分量"
              value={ingredientAmount}
              onChange={(event) => setIngredientAmount(event.target.value)}
            />
          </label>

          <label className="field">
            <input
              type="text"
              placeholder="単位"
              value={ingredientUnit}
              onChange={(event) => setIngredientUnit(event.target.value)}
            />
          </label>

          <button type="button" onClick={handleAddIngredient}>追加</button>
        </div>

        <ul className="ingredient-list ingredient-edit-list">
          {ingredients.map((ingredient) => (
            <li className="ingredient-item" key={ingredient.id}>
              <span className="ingredient-name">
                {ingredient.name} {ingredient.amount}
                {ingredient.unit}
              </span>
              <button type="button" onClick={() => handleRemoveIngredient(ingredient.id)}>
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="recipe-action-buttons form-actions">
        <button
          type="button"
          onClick={() => onSave({ name, description, baseAmount, ingredients })}
        >
          保存
        </button>
        <button type="button" onClick={onCancel}>キャンセル</button>
      </div>
    </section>
  )
}

export default RecipeForm
