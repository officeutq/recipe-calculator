import "./App.css"
import IngredientForm from "./components/IngredientForm"
import IngredientList from "./components/IngredientList"
import { useLocalStorageState } from "./hooks/useLocalStorageState"
import type { Ingredient, NewIngredient, Recipe } from "./types/ingredient"

const initialTargetServings = "2"

const initialIngredients: Ingredient[] = [
  { id: 1, name: "じゃがいも", amount: 3, unit: "個" },
  { id: 2, name: "にんじん", amount: 1, unit: "本" },
  { id: 3, name: "玉ねぎ", amount: 2, unit: "個" },
  { id: 4, name: "牛肉", amount: 300, unit: "g" },
]

const initialRecipes: Recipe[] = [
  {
    id: 1,
    name: "",
    description: "",
    baseAmount: 4,
    ingredients: initialIngredients,
  },
]

const storageKeys = {
  recipes: "recipe-calculator:recipes",
  selectedRecipeId: "recipe-calculator:selected-recipe-id",
  targetServings: "recipe-calculator:target-servings",
}

function App() {
  const [recipes, setRecipes] = useLocalStorageState<Recipe[]>(
    storageKeys.recipes,
    initialRecipes,
  )
  const [selectedRecipeId, setSelectedRecipeId] = useLocalStorageState<number>(
    storageKeys.selectedRecipeId,
    initialRecipes[0].id,
  )
  const [targetServings, setTargetServings] = useLocalStorageState(
    storageKeys.targetServings,
    initialTargetServings,
  )

  const selectedRecipe =
    recipes.find((recipe) => recipe.id === selectedRecipeId) ?? recipes[0]

  const baseServings = selectedRecipe ? String(selectedRecipe.baseAmount) : ""
  const recipeName = selectedRecipe?.name ?? ""
  const ingredients = selectedRecipe?.ingredients ?? []

  const baseServingsNumber = selectedRecipe?.baseAmount ?? 0
  const targetServingsNumber = Number(targetServings)
  const canCalculate = baseServingsNumber > 0 && targetServingsNumber > 0
  const scale = canCalculate ? targetServingsNumber / baseServingsNumber : null

  const updateSelectedRecipe = (updater: (recipe: Recipe) => Recipe) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === selectedRecipeId ? updater(recipe) : recipe,
      ),
    )
  }

  const handleAddIngredient = (newIngredient: NewIngredient) => {
    const nextIngredient: Ingredient = {
      id: Date.now(),
      ...newIngredient,
    }

    updateSelectedRecipe((recipe) => ({
      ...recipe,
      ingredients: [...recipe.ingredients, nextIngredient],
    }))
  }

  const handleRemoveIngredient = (id: number) => {
    updateSelectedRecipe((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredients.filter((ingredient) => ingredient.id !== id),
    }))
  }

  const handleResetRecipe = () => {
    setRecipes(initialRecipes)
    setSelectedRecipeId(initialRecipes[0].id)
    setTargetServings(initialTargetServings)
  }

  const handleRecipeNameChange = (name: string) => {
    updateSelectedRecipe((recipe) => ({
      ...recipe,
      name,
    }))
  }

  const handleBaseServingsChange = (value: string) => {
    const parsedValue = Number(value)

    updateSelectedRecipe((recipe) => ({
      ...recipe,
      baseAmount: Number.isNaN(parsedValue) ? 0 : parsedValue,
    }))
  }

  return (
    <main className="app">
      <section className="app-header">
        <p className="app-label">Recipe Calculator</p>
        <h1>レシピ計算機</h1>
        <p className="app-description">
          基準人数と作りたい人数を入力して、材料の分量を計算します。
        </p>
      </section>

      <section className="recipe-card" aria-labelledby="recipe-form-title">
        <div className="recipe-card-header">
          <h2 id="recipe-form-title">レシピ情報</h2>
          <button
            type="button"
            className="reset-button"
            onClick={handleResetRecipe}
          >
            リセット
          </button>
        </div>

        <div className="form-grid">
          <label className="field">
            <span>レシピ名</span>
            <input
              type="text"
              placeholder="例：カレー"
              value={recipeName}
              onChange={(event) => handleRecipeNameChange(event.target.value)}
            />
          </label>

          <label className="field">
            <span>基準人数</span>
            <input
              type="number"
              min="1"
              placeholder="例：4"
              value={baseServings}
              onChange={(event) => handleBaseServingsChange(event.target.value)}
            />
          </label>

          <label className="field">
            <span>作りたい人数</span>
            <input
              type="number"
              min="1"
              placeholder="例：6"
              value={targetServings}
              onChange={(event) => setTargetServings(event.target.value)}
            />
          </label>
        </div>

        <div className="preview-section">
          <h2>入力内容</h2>
          <dl className="preview-list">
            <div>
              <dt>レシピ名</dt>
              <dd>{recipeName || "未入力"}</dd>
            </div>
            <div>
              <dt>基準人数</dt>
              <dd>{baseServings || "未入力"}人分</dd>
            </div>
            <div>
              <dt>作りたい人数</dt>
              <dd>{targetServings || "未入力"}人分</dd>
            </div>
            <div>
              <dt>倍率</dt>
              <dd>{scale === null ? "計算不可" : `${scale}倍`}</dd>
            </div>
          </dl>
        </div>

        <div className="ingredients-section">
          <div className="section-header">
            <h2>材料</h2>
          </div>

          <IngredientForm onAddIngredient={handleAddIngredient} />

          <IngredientList
            ingredients={ingredients}
            scale={scale}
            onRemoveIngredient={handleRemoveIngredient}
          />
        </div>
      </section>
    </main>
  )
}

export default App
