import { useState } from "react"
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
  const [editingIngredientId, setEditingIngredientId] = useState<number | null>(null)
  const [isBaseAmountModalOpen, setIsBaseAmountModalOpen] = useState(false)
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false)
  const [prevInitialRecipe, setPrevInitialRecipe] = useState(initialRecipe)

  if (prevInitialRecipe !== initialRecipe) {
    setName(initialRecipe?.name ?? "")
    setDescription(initialRecipe?.description ?? "")
    setBaseAmount(initialRecipe ? String(initialRecipe.baseAmount) : "")
    setIngredients(initialRecipe?.ingredients ?? [])
    setEditingIngredientId(null)
    setIsIngredientModalOpen(false)
    setPrevInitialRecipe(initialRecipe)
  }

  const editingIngredient = editingIngredientId === null
    ? undefined
    : ingredients.find((ingredient) => ingredient.id === editingIngredientId)

  const handleOpenAddIngredientModal = () => {
    setEditingIngredientId(null)
    setIsIngredientModalOpen(true)
  }

  const handleOpenEditIngredientModal = (ingredientId: number) => {
    setEditingIngredientId(ingredientId)
    setIsIngredientModalOpen(true)
  }

  const handleCloseIngredientModal = () => {
    setIsIngredientModalOpen(false)
    setEditingIngredientId(null)
  }

  const handleSaveIngredient = (ingredient: { name: string; amount: number; unit: string }) => {
    if (editingIngredientId === null) {
      setIngredients((prevIngredients) => [
        ...prevIngredients,
        { id: Date.now(), ...ingredient },
      ])
      handleCloseIngredientModal()
      return
    }

    setIngredients((prevIngredients) =>
      prevIngredients.map((prevIngredient) =>
        prevIngredient.id === editingIngredientId
          ? { ...prevIngredient, ...ingredient }
          : prevIngredient,
      ),
    )
    handleCloseIngredientModal()
  }

  const handleRemoveIngredient = (ingredientId: number) => {
    const shouldDeleteIngredient = window.confirm("この材料を削除しますか？")

    if (!shouldDeleteIngredient) {
      return
    }

    setIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== ingredientId),
    )

    if (editingIngredientId === ingredientId) {
      handleCloseIngredientModal()
    }
  }

  return (
    <section className="recipe-card recipe-card--form" aria-labelledby="recipe-form-screen-title">
      <h2 id="recipe-form-screen-title">{title}</h2>

      <div className="form-grid">
        <label className="field field--inline recipe-form-inline-field recipe-form-inline-field--single">
          <span className="inline-label">レシピ名:</span>
          <input type="text" placeholder="レシピ名" value={name} onChange={(event) => setName(event.target.value)} />
        </label>

        <label className="field field--inline field--inline-top recipe-form-inline-field">
          <span className="inline-label">説明:</span>
          <textarea
            placeholder="説明"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
          />
        </label>

        <label className="field field--inline recipe-form-inline-field recipe-form-inline-field--single">
          <span className="inline-label">基準分量:</span>
          <input
            className="base-amount-input"
            type="text"
            inputMode="none"
            placeholder="基準量"
            value={baseAmount}
            readOnly
            onClick={() => setIsBaseAmountModalOpen(true)}
          />
        </label>
      </div>

      <div className="ingredients-section">
        <div className="section-header">
          <h2>材料</h2>
          <button type="button" className="ingredient-add-button" onClick={handleOpenAddIngredientModal}>
            材料追加
          </button>
        </div>

        <ul className="ingredient-list ingredient-edit-list">
          {ingredients.map((ingredient) => (
            <li className="ingredient-item" key={ingredient.id}>
              <span className="ingredient-name">
                {ingredient.name} {ingredient.amount}
                {ingredient.unit}
              </span>
              <div className="ingredient-actions">
                <button
                  type="button"
                  className="ingredient-icon-button"
                  aria-label="材料を編集"
                  onClick={() => handleOpenEditIngredientModal(ingredient.id)}
                >
                  ✏️
                </button>
                <button
                  type="button"
                  className="ingredient-icon-button"
                  aria-label="材料を削除"
                  onClick={() => handleRemoveIngredient(ingredient.id)}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <IngredientFormModal
        open={isIngredientModalOpen}
        title={editingIngredientId === null ? "材料追加" : "材料編集"}
        initialIngredient={editingIngredient}
        onClose={handleCloseIngredientModal}
        onSave={handleSaveIngredient}
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
