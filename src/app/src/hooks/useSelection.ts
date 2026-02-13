import { useMemo, useState } from 'react'
import { INGREDIENTS, type Ingredient } from '../constants/ingredients.js'
import { RULES } from '../constants/rules.js'

export type Step =
  | 'package manager'
  | 'foundation'
  | 'styling'
  | 'state'
  | 'backend'
  | 'review'
  | 'cooking'

const STEPS: Step[] = [
  'package manager',
  'foundation',
  'styling',
  'state',
  'backend',
  'review',
  'cooking'
]

export function useSelection() {
  const [currentStep, setCurrentStep] = useState<Step>('package manager')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [logs, setLogs] = useState<{ message: string; type: string }[]>([])
  const [isCooking, setIsCooking] = useState(false)

  const [packageManager, setPackageManager] = useState<'npm' | 'yarn' | 'pnpm'>('npm')

  const toggleSelection = (id: string) => {
    const ingredient = INGREDIENTS.find(
      (i: Ingredient) => i.id === id
    )
    if (!ingredient) return

    const next = new Set(selectedIds)

    if (next.has(id)) {
      // Item is currently selected, so uncheck it
      next.delete(id)
    } else {
      // Item is not selected, so select it
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
    if (currentStep === 'package manager') {
      return true // Always allow advancing from manager step
    }
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

  const goBackStep = () => {
    const idx = STEPS.indexOf(currentStep)
    if (idx > 0) {
      setCurrentStep(STEPS[idx - 1])
    }
  }

  const isDisabled = (ingredient: Ingredient) => {
    // Foundation ingredients should never be disabled
    if (ingredient.category === 'foundation') return false

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
    goBackStep,
    canAdvance,
    isDisabled,
    packageManager,
    setPackageManager
  }
}
