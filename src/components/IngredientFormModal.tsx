import { useEffect, useState } from "react"
import NumberInputModal from "./NumberInputModal"

type IngredientFormModalProps = {
  open: boolean
  title: string
  onClose: () => void
  onSave: (ingredient: {
    name: string
    amount: number
    unit: string
  }) => void
}

function IngredientFormModal({ open, title, onClose, onSave }: IngredientFormModalProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [unit, setUnit] = useState("")
  const [isAmountModalOpen, setIsAmountModalOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    setName("")
    setAmount("")
    setUnit("")
    setIsAmountModalOpen(false)
  }, [open])

  if (!open) {
    return null
  }

  const handleSave = () => {
    const trimmedName = name.trim()
    const amountNumber = Number(amount)
    const trimmedUnit = unit.trim()

    if (trimmedName === "") {
      alert("材料名を入力してください")
      return
    }

    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      alert("分量は0より大きい値を入力してください")
      return
    }

    if (trimmedUnit === "") {
      alert("単位を入力してください")
      return
    }

    onSave({
      name: trimmedName,
      amount: amountNumber,
      unit: trimmedUnit,
    })
  }

  return (
    <>
      <div className="ingredient-form-modal-overlay" role="presentation" onClick={onClose}>
        <div
          className="ingredient-form-modal"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={(event) => event.stopPropagation()}
        >
          <h2>{title}</h2>

          <div className="form-grid ingredient-form-modal-grid">
            <label className="field">
              <input
                type="text"
                placeholder="材料名"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label className="field">
              <input
                type="text"
                inputMode="none"
                placeholder="分量"
                value={amount}
                readOnly
                onClick={() => setIsAmountModalOpen(true)}
              />
            </label>

            <label className="field">
              <input
                type="text"
                placeholder="単位"
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
              />
            </label>
          </div>

          <div className="ingredient-form-modal-actions">
            <button type="button" onClick={handleSave}>保存</button>
            <button type="button" onClick={onClose}>キャンセル</button>
          </div>
        </div>
      </div>

      <NumberInputModal
        open={isAmountModalOpen}
        value={amount}
        allowDecimal
        onClose={() => setIsAmountModalOpen(false)}
        onConfirm={(value) => {
          setAmount(value)
          setIsAmountModalOpen(false)
        }}
      />
    </>
  )
}

export type { IngredientFormModalProps }
export default IngredientFormModal
