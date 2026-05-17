import { useEffect, useState } from "react"
import "./App.css"
import IngredientList from "./components/IngredientList"

type Ingredient = {
  id: number
  name: string
  amount: number
  unit: string
}

const initialIngredients: Ingredient[] = [
  { id: 1, name: "じゃがいも", amount: 3, unit: "個" },
  { id: 2, name: "にんじん", amount: 1, unit: "本" },
  { id: 3, name: "玉ねぎ", amount: 2, unit: "個" },
  { id: 4, name: "牛肉", amount: 300, unit: "g" },
]

const storageKeys = {
  recipeName: "recipe-calculator:recipe-name",
  baseServings: "recipe-calculator:base-servings",
  targetServings: "recipe-calculator:target-servings",
  ingredients: "recipe-calculator:ingredients",
}

const loadString = (key: string, fallback: string) => {
  const savedValue = localStorage.getItem(key)
  return savedValue ?? fallback
}

const loadIngredients = () => {
  const savedValue = localStorage.getItem(storageKeys.ingredients)

  if (savedValue === null) {
    return initialIngredients
  }

  try {
    const parsedValue = JSON.parse(savedValue)

    if (!Array.isArray(parsedValue)) {
      return initialIngredients
    }

    return parsedValue as Ingredient[]
  } catch {
    return initialIngredients
  }
}

function App() {
  const [recipeName, setRecipeName] = useState(() =>
    loadString(storageKeys.recipeName, ""),
  )
  const [baseServings, setBaseServings] = useState(() =>
    loadString(storageKeys.baseServings, "4"),
  )
  const [targetServings, setTargetServings] = useState(() =>
    loadString(storageKeys.targetServings, "2"),
  )
  const [ingredients, setIngredients] =
    useState<Ingredient[]>(loadIngredients)

  const [newIngredientName, setNewIngredientName] = useState("")
  const [newIngredientAmount, setNewIngredientAmount] = useState("")
  const [newIngredientUnit, setNewIngredientUnit] = useState("")

  useEffect(() => {
    localStorage.setItem(storageKeys.recipeName, recipeName)
  }, [recipeName])

  useEffect(() => {
    localStorage.setItem(storageKeys.baseServings, baseServings)
  }, [baseServings])

  useEffect(() => {
    localStorage.setItem(storageKeys.targetServings, targetServings)
  }, [targetServings])

  useEffect(() => {
    localStorage.setItem(storageKeys.ingredients, JSON.stringify(ingredients))
  }, [ingredients])

  const baseServingsNumber = Number(baseServings)
  const targetServingsNumber = Number(targetServings)
  const canCalculate = baseServingsNumber > 0 && targetServingsNumber > 0
  const scale = canCalculate ? targetServingsNumber / baseServingsNumber : null

  const handleAddIngredient = () => {
    const amountNumber = Number(newIngredientAmount)

    if (
      newIngredientName.trim() === "" ||
      newIngredientUnit.trim() === "" ||
      amountNumber <= 0
    ) {
      return
    }

    const nextIngredient: Ingredient = {
      id: Date.now(),
      name: newIngredientName.trim(),
      amount: amountNumber,
      unit: newIngredientUnit.trim(),
    }

    setIngredients([...ingredients, nextIngredient])
    setNewIngredientName("")
    setNewIngredientAmount("")
    setNewIngredientUnit("")
  }

  const handleRemoveIngredient = (id: number) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id))
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
        <h2 id="recipe-form-title">レシピ情報</h2>

        <div className="form-grid">
          <label className="field">
            <span>レシピ名</span>
            <input
              type="text"
              placeholder="例：カレー"
              value={recipeName}
              onChange={(event) => setRecipeName(event.target.value)}
            />
          </label>

          <label className="field">
            <span>基準人数</span>
            <input
              type="number"
              min="1"
              placeholder="例：4"
              value={baseServings}
              onChange={(event) => setBaseServings(event.target.value)}
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

          <div className="ingredient-form">
            <label className="field">
              <span>材料名</span>
              <input
                type="text"
                placeholder="例：卵"
                value={newIngredientName}
                onChange={(event) => setNewIngredientName(event.target.value)}
              />
            </label>

            <label className="field">
              <span>分量</span>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="例：2"
                value={newIngredientAmount}
                onChange={(event) => setNewIngredientAmount(event.target.value)}
              />
            </label>

            <label className="field">
              <span>単位</span>
              <input
                type="text"
                placeholder="例：個"
                value={newIngredientUnit}
                onChange={(event) => setNewIngredientUnit(event.target.value)}
              />
            </label>

            <button type="button" onClick={handleAddIngredient}>
              材料を追加
            </button>
          </div>

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
