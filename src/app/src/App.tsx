import { useState } from 'react'

import { useSelection } from './hooks/useSelection.js'
import { useSocket } from './hooks/useSocket.js'
import { Stepper } from './components/Stepper.js'
import { PackageManagerStep } from './components/PackageManagerStep.js'
import { IngredientSelectionStep } from './components/IngredientSelectionStep.js'
import { Summary } from './components/Summary.js'
import { CookingView } from './components/CookingView.js'
import { ForceModal } from './components/ForceModal.js'

import { INGREDIENTS, type Ingredient } from './constants/ingredients.js'
import { buildCookPayload } from './utils/buildCookPayload.js'

function App() {
  const [error, setError] = useState<string | undefined>(undefined)
  const [forceModalOpen, setForceModalOpen] = useState(false)
  const [force, setForce] = useState(false)
  const [cookingComplete, setCookingComplete] = useState(false)

  const {
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
    isDisabled,
    canAdvance,
    packageManager,
    setPackageManager
  } = useSelection()

  // Socket handling
  useSocket({
    onLog: (log) => setLogs(prev => [...prev, log]),
    onComplete: (data) => {
      setLogs(prev => [
        ...prev,
        {
          message: data.success ? 'Done.' : data.error ?? 'Failed.',
          type: data.success ? 'success' : 'error'
        }
      ])
      setIsCooking(false)
      setCookingComplete(true)
    }
  })

  const currentIngredients = INGREDIENTS.filter(
    (i: Ingredient) => i.category === currentStep
  )

  const handleCook = async () => {
    // If force is enabled, show modal for confirmation
    if (force) {
      setForceModalOpen(true)
      return
    }

    // Otherwise, proceed with normal cooking
    await startCooking(false)
  }

  const handleForceConfirm = async () => {
    setForceModalOpen(false)
    await startCooking(true)
  }

  const startCooking = async (forceFlag: boolean) => {
    setIsCooking(true)
    setLogs([])

    console.log('selectedIngredients', selectedIngredients)

    try {
      const payload = buildCookPayload(
        selectedIngredients,
        packageManager,
        forceFlag
      )

      console.log('payload', payload)

      const res = await fetch('/cook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      }

      if (!res.ok) {
        setError('Failed to start cooking')
      }
    } catch (err) {
      console.error(err)
      setIsCooking(false)
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-8 font-sans">
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2">
          <img src="/ss-logo.svg" alt="StackSauté" className="w-12 h-12 mb-4" />
          <h1 className="text-4xl md:text-5xl font-light bg-linear-to-br from-orange-400 to-red-600 bg-clip-text text-transparent mb-2">
            Stack<span className="font-bold">Sauté</span>
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        {!isCooking && !cookingComplete && (
          <Stepper
            steps={steps}
            currentStep={currentStep}
          />
        )}

        {!isCooking && currentStep === 'package manager' && (
          <PackageManagerStep
            packageManager={packageManager}
            setPackageManager={setPackageManager}
            onContinue={advanceStep}
            canAdvance={canAdvance}
          />
        )}

        {!isCooking &&
          currentStep !== 'package manager' &&
          currentStep !== 'review' && (
            <IngredientSelectionStep
              ingredients={currentIngredients}
              selectedIds={selectedIds}
              isDisabled={isDisabled}
              onToggle={toggleSelection}
              onBack={goBackStep}
              onContinue={advanceStep}
              canAdvance={canAdvance}
            />
          )}

        {!isCooking && !cookingComplete && currentStep === 'review' && (
          <Summary
            selectedIngredients={selectedIngredients}
            packageManager={packageManager}
            force={force}
            onForceChange={setForce}
            onCook={handleCook}
            onBack={goBackStep}
            isLoading={isCooking}
          />
        )}

        {(isCooking || cookingComplete) && (
          <CookingView logs={logs} error={error} isCookingComplete={cookingComplete} />
        )}

        <ForceModal
          isOpen={forceModalOpen}
          onClose={() => setForceModalOpen(false)}
          onConfirm={handleForceConfirm}
          isLoading={isCooking}
        />
      </main>
    </div>
  )
}

export default App
