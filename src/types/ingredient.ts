export type Ingredient = {
  id: number
  name: string
  amount: number
  unit: string
}

export type Recipe = {
  id: number
  name: string
  description: string
  baseAmount: number
  ingredients: Ingredient[]
}

export type NewIngredient = {
  name: string
  amount: number
  unit: string
}
