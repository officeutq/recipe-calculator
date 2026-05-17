import type { Recipe } from "../types/ingredient"

type RecipeFormProps = {
  title: string
  initialRecipe?: Recipe
  onSave: () => void
  onCancel: () => void
}

function RecipeForm({ title, initialRecipe, onSave, onCancel }: RecipeFormProps) {
  return (
    <section className="recipe-card" aria-labelledby="recipe-form-screen-title">
      <h2 id="recipe-form-screen-title">{title}</h2>

      <div className="form-grid">
        <label className="field">
          <input
            type="text"
            placeholder="レシピ名"
            defaultValue={initialRecipe?.name ?? ""}
          />
        </label>

        <label className="field">
          <input
            type="text"
            placeholder="説明"
            defaultValue={initialRecipe?.description ?? ""}
          />
        </label>

        <label className="field">
          <input
            type="number"
            min="1"
            placeholder="基準量"
            defaultValue={initialRecipe?.baseAmount ?? ""}
          />
        </label>
      </div>

      <div className="recipe-action-buttons form-actions">
        <button type="button" onClick={onSave}>保存</button>
        <button type="button" onClick={onCancel}>キャンセル</button>
      </div>
    </section>
  )
}

export default RecipeForm
