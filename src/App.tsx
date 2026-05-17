import "./App.css"

function App() {
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
            <input type="text" placeholder="例：カレー" />
          </label>

          <label className="field">
            <span>基準人数</span>
            <input type="number" min="1" placeholder="例：4" />
          </label>

          <label className="field">
            <span>作りたい人数</span>
            <input type="number" min="1" placeholder="例：6" />
          </label>
        </div>

        <div className="ingredients-section">
          <div className="section-header">
            <h2>材料</h2>
            <button type="button">材料を追加</button>
          </div>

          <div className="empty-state">
            まだ材料がありません。材料を追加して、分量計算を始めましょう。
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
