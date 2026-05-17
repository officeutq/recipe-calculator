import "./App.css"
import IngredientList from "./components/IngredientList"
import RecipeForm from "./components/RecipeForm"
import { useLocalStorageState } from "./hooks/useLocalStorageState"
import type { Ingredient, Recipe } from "./types/ingredient"

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
    name: "カレー",
    description: "定番の家庭用カレー",
    baseAmount: 4,
    ingredients: initialIngredients,
  },
]

type ScreenMode = "calculator" | "new" | "edit"

type RecipeFormValues = {
  name: string
  description: string
  baseAmount: string
}

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
  const [selectedRecipeId, setSelectedRecipeId] = useLocalStorageState<number | null>(
    storageKeys.selectedRecipeId,
    null,
  )
  const [targetServings, setTargetServings] = useLocalStorageState(
    storageKeys.targetServings,
    initialTargetServings,
  )
  const [screenMode, setScreenMode] = useLocalStorageState<ScreenMode>(
    "recipe-calculator:screen-mode",
    "calculator",
  )

  const selectedRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId)

  const baseServingsNumber = selectedRecipe?.baseAmount ?? 0
  const ingredients = selectedRecipe?.ingredients ?? []
  const description = selectedRecipe?.description ?? ""

  const targetServingsNumber = Number(targetServings)
  const canCalculate = baseServingsNumber > 0 && targetServingsNumber > 0
  const scale = canCalculate ? targetServingsNumber / baseServingsNumber : null

  const validateRecipeFormValues = (values: RecipeFormValues): number | null => {
    const name = values.name.trim()
    if (name === "") {
      alert("レシピ名を入力してください")
      return null
    }

    const baseAmount = Number(values.baseAmount)
    if (!Number.isFinite(baseAmount) || baseAmount < 1) {
      alert("基準量は1以上を入力してください")
      return null
    }

    return baseAmount
  }

  const handleSaveNewRecipe = (values: RecipeFormValues) => {
    const baseAmount = validateRecipeFormValues(values)
    if (baseAmount === null) {
      return
    }

    const newRecipe: Recipe = {
      id: Date.now(),
      name: values.name.trim(),
      description: values.description.trim(),
      baseAmount,
      ingredients: [],
    }

    setRecipes((prevRecipes) => [...prevRecipes, newRecipe])
    setSelectedRecipeId(newRecipe.id)
    setScreenMode("calculator")
  }

  const handleSaveEditedRecipe = (values: RecipeFormValues) => {
    if (!selectedRecipe) {
      return
    }

    const baseAmount = validateRecipeFormValues(values)
    if (baseAmount === null) {
      return
    }

    const updatedRecipe: Recipe = {
      ...selectedRecipe,
      name: values.name.trim(),
      description: values.description.trim(),
      baseAmount,
    }

    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe,
      ),
    )
    setScreenMode("calculator")
  }

  const handleResetRecipe = () => {
    setRecipes(initialRecipes)
    setSelectedRecipeId(null)
    setTargetServings(initialTargetServings)
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

      {screenMode === "calculator" && (
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

          <div className="recipe-action-buttons">
            <button type="button" onClick={() => setScreenMode("new")}>レシピ新規作成</button>
            {selectedRecipeId !== null && (
              <button type="button" onClick={() => setScreenMode("edit")}>レシピ編集</button>
            )}
          </div>

          <div className="form-grid">
            <label className="field">
              <select
                value={selectedRecipeId ?? ""}
                onChange={(event) => {
                  const nextValue = event.target.value
                  setSelectedRecipeId(nextValue === "" ? null : Number(nextValue))
                }}
              >
                <option value="">レシピ名</option>
                {recipes.map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </option>
                ))}
              </select>
            </label>

            {selectedRecipe && <p className="recipe-description">{description}</p>}

            <p className="base-amount">基準量: {baseServingsNumber || "-"}</p>

            <label className="field">
              <input
                type="number"
                min="1"
                placeholder="作成量"
                value={targetServings}
                onChange={(event) => setTargetServings(event.target.value)}
              />
            </label>
          </div>

          <div className="ingredients-section">
            <div className="section-header">
              <h2>材料</h2>
            </div>

            <IngredientList ingredients={ingredients} scale={scale} />
          </div>
        </section>
      )}

      {screenMode === "new" && (
        <RecipeForm
          title="レシピ新規作成"
          onSave={handleSaveNewRecipe}
          onCancel={() => setScreenMode("calculator")}
        />
      )}

      {screenMode === "edit" && selectedRecipe && (
        <RecipeForm
          title="レシピ編集"
          initialRecipe={selectedRecipe}
          onSave={handleSaveEditedRecipe}
          onCancel={() => setScreenMode("calculator")}
        />
      )}
    </main>
  )
}

export default App
