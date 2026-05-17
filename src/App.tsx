import { useEffect, useState } from "react"
import "./App.css"
import IngredientList from "./components/IngredientList"
import NumberInputModal from "./components/NumberInputModal"
import RecipeForm, { type RecipeFormValues } from "./components/RecipeForm"
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
  const [isTargetServingsModalOpen, setIsTargetServingsModalOpen] = useState(false)

  const selectedRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId)
  const hasRecipes = recipes.length > 0

  useEffect(() => {
    if (recipes.length === 0) {
      if (selectedRecipeId !== null) {
        setSelectedRecipeId(null)
      }
      return
    }

    if (selectedRecipeId === null) {
      setSelectedRecipeId(recipes[0].id)
      return
    }

    const hasSelectedRecipe = recipes.some((recipe) => recipe.id === selectedRecipeId)
    if (!hasSelectedRecipe) {
      setSelectedRecipeId(recipes[0].id)
    }
  }, [recipes, selectedRecipeId, setSelectedRecipeId])

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
      ingredients: values.ingredients,
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
      ingredients: values.ingredients,
    }

    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe,
      ),
    )
    setScreenMode("calculator")
  }

  const handleDeleteRecipe = () => {
    if (!selectedRecipe) {
      return
    }

    const shouldDelete = window.confirm("このレシピを削除しますか？")
    if (!shouldDelete) {
      return
    }

    const nextRecipes = recipes.filter((recipe) => recipe.id !== selectedRecipe.id)
    setRecipes(nextRecipes)
    setSelectedRecipeId(nextRecipes.length > 0 ? nextRecipes[0].id : null)
    setScreenMode("calculator")
  }

  return (
    <main className="app">
      <section className="app-header">
        <p className="app-label">Recipe Calculator</p>
        <h1>レシピ計算機</h1>
        <p className="app-description">
          基準分量と作りたい分量を入力して、材料の分量を計算します。
        </p>
      </section>

      {screenMode === "calculator" && (
        <section className="recipe-card recipe-card--calculator">
          <div className="form-grid">
            {hasRecipes ? (
              <>
                <label className="field recipe-select-field">
                  <span className="inline-label">レシピ:</span>
                  <select
                    value={selectedRecipeId ?? ""}
                    onChange={(event) => {
                      setSelectedRecipeId(Number(event.target.value))
                    }}
                  >
                    {recipes.map((recipe) => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="recipe-action-buttons">
                  <button type="button" onClick={() => setScreenMode("new")}>レシピ新規作成</button>
                  {selectedRecipe && (
                    <button type="button" onClick={() => setScreenMode("edit")}>レシピ編集</button>
                  )}
                </div>

                <div className="servings-row">
                  <p className="base-amount">基準分量: {baseServingsNumber || "-"}</p>
                  <span className="servings-arrow" aria-hidden="true">→</span>
                  <label className="field servings-target-field">
                    <span className="inline-label">今回の分量</span>
                    <input
                    type="text"
                    inputMode="none"
                    placeholder="作成量"
                    value={targetServings}
                    readOnly
                    onClick={() => setIsTargetServingsModalOpen(true)}
                  />
                  </label>
                </div>
              </>
            ) : (
              <>
                <p className="empty-state-message">レシピがありません</p>
                <div className="recipe-action-buttons">
                  <button type="button" onClick={() => setScreenMode("new")}>レシピ新規作成</button>
                </div>
              </>
            )}
          </div>

          <NumberInputModal
            open={isTargetServingsModalOpen}
            value={targetServings}
            allowDecimal={false}
            onClose={() => setIsTargetServingsModalOpen(false)}
            onConfirm={(value) => {
              setTargetServings(value)
              setIsTargetServingsModalOpen(false)
            }}
          />

          {hasRecipes && (
            <>
              <div className="ingredients-section">
                <div className="section-header">
                  <h2>材料</h2>
                </div>

                <IngredientList ingredients={ingredients} scale={scale} />
              </div>

              {selectedRecipe && description !== "" && (
                <div className="description-section">
                  <h2>{selectedRecipe.name}レシピの説明</h2>
                  <p className="recipe-description">{description}</p>
                </div>
              )}
            </>
          )}
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
          onDelete={handleDeleteRecipe}
        />
      )}
    </main>
  )
}

export default App
