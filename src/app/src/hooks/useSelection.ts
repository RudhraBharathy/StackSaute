import { useMemo, useState } from 'react'
import { INGREDIENTS, type Ingredient } from '../constants/ingredients.js'

export type Step =
  | 'package manager'
  | 'foundation'
  | 'viteTemplate'
  | 'nextConfig'
  | 'styling'
  | 'state'
  | 'backend'
  | 'review'

export function useSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [logs, setLogs] = useState<{ message: string; type: string }[]>([])
  const [isCooking, setIsCooking] = useState(false)
  const [packageManager, setPackageManager] =
    useState<'npm' | 'yarn' | 'pnpm'>('npm')

  const selectedIngredients = useMemo(
    () => INGREDIENTS.filter(i => selectedIds.has(i.id)),
    [selectedIds]
  )

  const foundation = selectedIngredients.find(
    i => i.category === 'foundation'
  )

  const steps: Step[] = useMemo(() => {
    const base: Step[] = ['package manager', 'foundation']

    if (foundation?.id === 'vite') {
      base.push('viteTemplate')
    }

    if (foundation?.id === 'nextjs') {
      base.push('nextConfig')
    }

    base.push('styling', 'state', 'backend', 'review')

    return base
  }, [foundation])

  const [currentIndex, setCurrentIndex] = useState(0)

  const currentStep = steps[currentIndex]

  const toggleSelection = (id: string) => {
    const ingredient = INGREDIENTS.find(i => i.id === id)
    if (!ingredient) return

    const next = new Set(selectedIds)

    if (next.has(id)) {
      next.delete(id)
    } else {
      if (ingredient.exclusiveGroup) {
        INGREDIENTS.filter(
          i => i.exclusiveGroup === ingredient.exclusiveGroup
        ).forEach(i => next.delete(i.id))
      }
      next.add(id)
    }

    setSelectedIds(next)
  }

  const canAdvance = useMemo(() => {
    if (currentStep === 'package manager') return true

    if (currentStep === 'foundation') {
      return !!foundation
    }

    if (currentStep === 'viteTemplate') {
      return selectedIngredients.some(
        i => i.category === 'viteTemplate'
      )
    }

    if (currentStep === 'nextConfig') {
      return selectedIngredients.some(
        i =>
          i.category === 'nextConfig' &&
          (i.id === 'typescript' || i.id === 'javascript')
      )
    }

    return true
  }, [currentStep, foundation, selectedIngredients])

  const advanceStep = () => {
    if (!canAdvance) return

    if (foundation?.id === 'nextjs' && selectedIngredients.some(i => i.id === 'tailwind') && currentStep === 'nextConfig') {
      setCurrentIndex(prev => prev + 1)
    }

    if (currentIndex < steps.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const goBackStep = () => {
    if (foundation?.id === 'nextjs' && selectedIngredients.some(i => i.id === 'tailwind') && currentStep === 'state') {
      setCurrentIndex(prev => prev - 1)
    }

    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const isDisabled = (ingredient: Ingredient) => {
    if (ingredient.category === 'viteTemplate') {
      return foundation?.id !== 'vite'
    }

    if (ingredient.category === 'nextConfig') {
      return foundation?.id !== 'nextjs'
    }

    return false
  }

  return {
    currentStep,
    steps,
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
