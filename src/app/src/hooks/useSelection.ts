import { useMemo, useState } from 'react'
import { INGREDIENTS, type Ingredient } from '../constants/ingredients.js'
import { RULES } from '../constants/rules.js'

export type Step =
  | 'foundation'
  | 'styling'
  | 'state'
  | 'backend'
  | 'review'
  | 'cooking'

const STEPS: Step[] = [
  'foundation',
  'styling',
  'state',
  'backend',
  'review',
  'cooking'
]

export function useSelection() {
  const [currentStep, setCurrentStep] = useState<Step>('foundation')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [logs, setLogs] = useState<{ message: string; type: string }[]>([])
  const [isCooking, setIsCooking] = useState(false)

  const toggleSelection = (id: string) => {
    const ingredient = INGREDIENTS.find(
      (i: Ingredient) => i.id === id
    )
    if (!ingredient) return

    const next = new Set(selectedIds)

    if (next.has(id)) {
      next.delete(id)
    } else {
      if (ingredient.exclusiveGroup) {
        INGREDIENTS.filter(
          (i: Ingredient) => i.exclusiveGroup === ingredient.exclusiveGroup
        ).forEach((i: Ingredient) => next.delete(i.id))
      }

      RULES.exclusions[
        id as keyof typeof RULES.exclusions
      ]?.forEach((conflict: string) => next.delete(conflict))

      RULES.dependencies[
        id as keyof typeof RULES.dependencies
      ]?.forEach((dep: string) => next.add(dep))

      next.add(id)
    }

    setSelectedIds(next)
  }

  const selectedIngredients = useMemo(
    () =>
      INGREDIENTS.filter((i: Ingredient) =>
        selectedIds.has(i.id)
      ),
    [selectedIds]
  )

  const canAdvance = useMemo(() => {
    if (currentStep === 'foundation') {
      return selectedIngredients.some(
        (i: Ingredient) => i.category === 'foundation'
      )
    }
    return true
  }, [currentStep, selectedIngredients])

  const advanceStep = () => {
    if (!canAdvance) return
    const idx = STEPS.indexOf(currentStep)
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1])
    }
  }

  const isDisabled = (ingredient: Ingredient) => {
    const foundation = selectedIngredients.find(
      (i: Ingredient) => i.category === 'foundation'
    )
    if (!foundation) return false

    if (ingredient.frameworks?.length) {
      return !ingredient.frameworks.includes(foundation.id)
    }

    return false
  }

  return {
    currentStep,
    selectedIds,
    selectedIngredients,
    logs,
    setLogs,
    isCooking,
    setIsCooking,
    toggleSelection,
    advanceStep,
    canAdvance,
    isDisabled
  }
}
