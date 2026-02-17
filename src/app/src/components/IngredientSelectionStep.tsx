import React from 'react'
import { IngredientCard } from './IngredientCard.js'
import type { Ingredient } from '../constants/ingredients.js'

interface Props {
  ingredients: Ingredient[]
  selectedIds: Set<string>
  isDisabled: (ingredient: Ingredient) => boolean
  onToggle: (id: string) => void
  onBack: () => void
  onContinue: () => void
  canAdvance: boolean
}

export const IngredientSelectionStep: React.FC<Props> = ({
  ingredients,
  selectedIds,
  isDisabled,
  onToggle,
  onBack,
  onContinue,
  canAdvance
}) => {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ingredients.map((ingredient: Ingredient) => (
          <IngredientCard
            key={ingredient.id}
            ingredient={ingredient}
            isSelected={selectedIds.has(ingredient.id)}
            isDisabled={isDisabled(ingredient)}
            onToggle={onToggle}
          />
        ))}
      </div>

      <div className="mt-12 flex justify-between">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-full bg-gray-800"
        >
          ← Back
        </button>

        <button
          onClick={onContinue}
          disabled={!canAdvance}
          className={`px-8 py-3 rounded-full font-bold ${canAdvance
            ? 'bg-orange-500 text-black'
            : 'bg-gray-800 text-gray-600'
            }`}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
