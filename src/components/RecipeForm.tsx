import { useEffect, useState } from "react"
import NumberInputModal from "./NumberInputModal"
import IngredientFormModal from "./IngredientFormModal"
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
  onDelete?: () => void
}

function RecipeForm({ title, initialRecipe, onSave, onCancel, onDelete }: RecipeFormProps) {
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
  const [editingIngredientId, setEditingIngredientId] = useState<number | null>(null)
  const [isBaseAmountModalOpen, setIsBaseAmountModalOpen] = useState(false)
  const [isIngredientAmountModalOpen, setIsIngredientAmountModalOpen] = useState(false)
  const [isIngredientFormModalOpen, setIsIngredientFormModalOpen] = useState(false)

  useEffect(() => {
    setName(initialRecipe?.name ?? "")
    setDescription(initialRecipe?.description ?? "")
    setBaseAmount(initialRecipe ? String(initialRecipe.baseAmount) : "")
    setIngredients(initialRecipe?.ingredients ?? [])
    setIngredientName("")
    setIngredientAmount("")
    setIngredientUnit("")
    setEditingIngredientId(null)
  }, [initialRecipe])

  const resetIngredientEditor = () => {
    setIngredientName("")
    setIngredientAmount("")
    setIngredientUnit("")
    setEditingIngredientId(null)
  }

  const handleAddIngredient = (ingredient: { name: string; amount: number; unit: string }) => {
    setIngredients((prevIngredients) => [
      ...prevIngredients,
      { id: Date.now(), ...ingredient },
    ])
    setIsIngredientFormModalOpen(false)
  }

  const handleUpdateIngredient = () => {
    if (editingIngredientId === null) {
      return
    }

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

    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.id === editingIngredientId
          ? { ...ingredient, name: trimmedName, amount, unit: trimmedUnit }
          : ingredient,
      ),
    )

    resetIngredientEditor()
  }

  const handleEditIngredient = (ingredientId: number) => {
    const targetIngredient = ingredients.find((ingredient) => ingredient.id === ingredientId)

    if (!targetIngredient) {
      return
    }

    setIngredientName(targetIngredient.name)
    setIngredientAmount(String(targetIngredient.amount))
    setIngredientUnit(targetIngredient.unit)
    setEditingIngredientId(targetIngredient.id)
  }

  const handleRemoveIngredient = (ingredientId: number) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== ingredientId),
    )

    if (editingIngredientId === ingredientId) {
      resetIngredientEditor()
    }
  }

  return (
    <section className="recipe-card" aria-labelledby="recipe-form-screen-title">
      <h2 id="recipe-form-screen-title">{title}</h2>

      <div className="form-grid">
        <label className="field">
          <input type="text" placeholder="レシピ名" value={name} onChange={(event) => setName(event.target.value)} />
        </label>

        <label className="field">
          <input type="text" placeholder="説明" value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>

        <label className="field">
          <input type="text" inputMode="none" placeholder="基準量" value={baseAmount} readOnly onClick={() => setIsBaseAmountModalOpen(true)} />
        </label>
      </div>

      <div className="ingredients-section">
        <div className="section-header">
          <h2>材料</h2>
        </div>

        <button type="button" onClick={() => setIsIngredientFormModalOpen(true)}>
          材料追加
        </button>

        {editingIngredientId !== null && (
          <div className="form-grid ingredient-editor-grid">
            <label className="field">
              <input type="text" placeholder="材料名" value={ingredientName} onChange={(event) => setIngredientName(event.target.value)} />
            </label>

            <label className="field">
              <input type="text" inputMode="none" placeholder="分量" value={ingredientAmount} readOnly onClick={() => setIsIngredientAmountModalOpen(true)} />
            </label>

            <label className="field">
              <input type="text" placeholder="単位" value={ingredientUnit} onChange={(event) => setIngredientUnit(event.target.value)} />
            </label>

            <button type="button" onClick={handleUpdateIngredient}>更新</button>
            <button type="button" onClick={resetIngredientEditor}>キャンセル</button>
          </div>
        )}

        <ul className="ingredient-list ingredient-edit-list">
          {ingredients.map((ingredient) => (
            <li className="ingredient-item" key={ingredient.id}>
              <span className="ingredient-name">
                {ingredient.name} {ingredient.amount}
                {ingredient.unit}
              </span>
              <div className="ingredient-actions">
                <button type="button" onClick={() => handleEditIngredient(ingredient.id)}>編集</button>
                <button type="button" onClick={() => handleRemoveIngredient(ingredient.id)}>削除</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <IngredientFormModal open={isIngredientFormModalOpen} title="材料追加" onClose={() => setIsIngredientFormModalOpen(false)} onSave={handleAddIngredient} />

      <NumberInputModal
        open={isIngredientAmountModalOpen}
        value={ingredientAmount}
        allowDecimal
        onClose={() => setIsIngredientAmountModalOpen(false)}
        onConfirm={(value) => {
          setIngredientAmount(value)
          setIsIngredientAmountModalOpen(false)
        }}
      />

      <NumberInputModal
        open={isBaseAmountModalOpen}
        value={baseAmount}
        allowDecimal={false}
        onClose={() => setIsBaseAmountModalOpen(false)}
        onConfirm={(value) => {
          setBaseAmount(value)
          setIsBaseAmountModalOpen(false)
        }}
      />

      <div className="recipe-action-buttons form-actions">
        <button type="button" onClick={() => onSave({ name, description, baseAmount, ingredients })}>保存</button>
        <button type="button" onClick={onCancel}>キャンセル</button>
        {onDelete && <button type="button" onClick={onDelete}>削除</button>}
      </div>
    </section>
  )
}

export default RecipeForm
