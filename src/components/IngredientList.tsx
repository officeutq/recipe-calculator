import type { Ingredient } from "../types/ingredient"

type IngredientListProps = {
  ingredients: Ingredient[]
  scale: number | null
}

function IngredientList({ ingredients, scale }: IngredientListProps) {
  return (
    <ul className="ingredient-list">
      {ingredients.map((ingredient) => {
        const scaledAmount = scale === null ? null : ingredient.amount * scale

        return (
          <li className="ingredient-item" key={ingredient.id}>
            <span className="ingredient-name">{ingredient.name}</span>

            <span className="ingredient-amount">
              <span className="original-amount">
                {ingredient.amount}
                {ingredient.unit}
              </span>
              <span aria-hidden="true">→</span>
              <span>{scaledAmount === null ? "-" : `${scaledAmount}${ingredient.unit}`}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default IngredientList
