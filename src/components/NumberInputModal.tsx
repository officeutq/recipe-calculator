import { useEffect, useState } from "react"
import type { ReactNode } from "react"

type NumberInputModalProps = {
  open: boolean
  value: string
  allowDecimal?: boolean
  onClose: () => void
  onConfirm: (value: string) => void
}

type KeyButton = {
  key: string
  label: ReactNode
}

const KEY_BUTTONS: KeyButton[] = [
  { key: "7", label: "7" },
  { key: "8", label: "8" },
  { key: "9", label: "9" },
  { key: "4", label: "4" },
  { key: "5", label: "5" },
  { key: "6", label: "6" },
  { key: "1", label: "1" },
  { key: "2", label: "2" },
  { key: "3", label: "3" },
  { key: "0", label: "0" },
  { key: ".", label: "." },
  { key: "backspace", label: "←" },
]

function NumberInputModal({
  open,
  value: _value,
  allowDecimal = true,
  onClose,
  onConfirm,
}: NumberInputModalProps) {
  const [inputValue, setInputValue] = useState("0")

  useEffect(() => {
    if (open) {
      setInputValue("0")
    }
  }, [open])

  if (!open) {
    return null
  }

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setInputValue((prev) => {
        if (prev.length <= 1) {
          return "0"
        }

        const next = prev.slice(0, -1)
        return next === "" ? "0" : next
      })
      return
    }

    if (key === ".") {
      if (!allowDecimal || inputValue.includes(".")) {
        return
      }

      setInputValue((prev) => (prev === "0" ? "0." : `${prev}.`))
      return
    }

    setInputValue((prev) => {
      if (prev === "0") {
        return key
      }

      return `${prev}${key}`
    })
  }

  return (
    <div className="number-input-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="number-input-modal"
        role="dialog"
        aria-modal="true"
        aria-label="数値入力"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="number-input-display">{inputValue === "" ? "0" : inputValue}</p>

        <div className="number-input-key-grid">
          {KEY_BUTTONS.map((button) => (
            <button
              key={button.key}
              type="button"
              onClick={() => handleKeyPress(button.key)}
              disabled={button.key === "." && !allowDecimal}
            >
              {button.label}
            </button>
          ))}
        </div>

        <div className="number-input-actions">
          <button type="button" onClick={() => setInputValue("0")}>クリア</button>
          <button type="button" onClick={onClose}>キャンセル</button>
          <button type="button" onClick={() => onConfirm(inputValue === "" ? "0" : inputValue)}>決定</button>
        </div>
      </div>
    </div>
  )
}

export type { NumberInputModalProps }
export default NumberInputModal
