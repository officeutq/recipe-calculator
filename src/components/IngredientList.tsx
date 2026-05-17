import type { Ingredient } from "../types/ingredient"

type IngredientListProps = {
  ingredients: Ingredient[]
  scale: number | null
  onRemoveIngredient: (id: number) => void
}

function IngredientList({
  ingredients,
  scale,
  onRemoveIngredient,
}: IngredientListProps) {
  return (
    <ul className="ingredient-list">
      {ingredients.map((ingredient) => {
        const scaledAmount =
          scale === null ? null : ingredient.amount * scale

        return (
          <li className="ingredient-item" key={ingredient.id}>
            <span className="ingredient-name">{ingredient.name}</span>

            <span className="ingredient-actions">
              <span className="ingredient-amount">
                <span className="original-amount">
                  {ingredient.amount}
                  {ingredient.unit}
                </span>
                <span aria-hidden="true">→</span>
                <span>
                  {scaledAmount === null
                    ? "-"
                    : `${scaledAmount}${ingredient.unit}`}
                </span>
              </span>

              <button
                type="button"
                className="remove-button"
                onClick={() => onRemoveIngredient(ingredient.id)}
              >
                削除
              </button>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default IngredientList
