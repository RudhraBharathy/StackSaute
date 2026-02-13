import { useEffect } from 'react'
import { io } from 'socket.io-client'

import { useSelection } from './hooks/useSelection.js'
import { Stepper } from './components/Stepper.js'
import { IngredientCard } from './components/IngredientCard.js'
import { Summary } from './components/Summary.js'
import { TerminalLog } from './components/TerminalLog.js'

import { INGREDIENTS, type Ingredient } from './constants/ingredients.js'
import { SiNpm, SiYarn, SiPnpm } from 'react-icons/si'


function App() {
  const {
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
    isDisabled,
    canAdvance,
    packageManager,
    setPackageManager
  } = useSelection()

  // Socket.IO connection for live logs
  useEffect(() => {
    const socket = io()

    socket.on('log', (log: { message: string; type: string }) => {
      setLogs(prev => [...prev, log])
    })

    socket.on(
      'cooking_complete',
      (data: { success: boolean; error?: string }) => {
        setLogs(prev => [
          ...prev,
          {
            message: data.success ? 'Done.' : data.error ?? 'Failed.',
            type: data.success ? 'success' : 'error'
          }
        ])
      }
    )

    return () => {
      socket.disconnect()
    }
  }, [setLogs])

  const handleCook = async () => {
    setIsCooking(true)
    setLogs([])

    try {
      const framework = selectedIngredients.find(
        (i: Ingredient) => i.category === 'foundation'
      )

      const payload = {
        framework: framework?.id,
        manager: packageManager,
        typescript: true,
        packages: selectedIngredients
          .filter((i: Ingredient) => i.category !== 'foundation')
          .map((i: Ingredient) => i.id)
      }

      const res = await fetch('/cook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error('Failed to start cooking')
      }
    } catch (err) {
      console.error(err)
      setIsCooking(false)
    }
  }

  const currentIngredients = INGREDIENTS.filter(
    (i: Ingredient) => i.category === currentStep
  )

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-8 font-sans selection:bg-orange-500/30">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2">
          <img src="/ss-logo.svg" alt="StackSauté" className="w-12 h-12 mb-4" />
          <h1 className="text-4xl md:text-5xl font-light bg-gradient-to-br from-orange-400 to-red-600 bg-clip-text text-transparent mb-2">
            Stack<span className='font-bold'>Sauté</span>
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        {/* Stepper */}
        {!isCooking && (
          <Stepper
            steps={['package manager', 'foundation', 'styling', 'state', 'backend', 'review']}
            currentStep={currentStep}
          />
        )}

        {/* Package Manager Selection - Step 1 */}
        {!isCooking && currentStep === 'package manager' && (
          <div className="mt-8 animate-fade-in">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-2 text-white">
                Choose Your Package Manager
              </h2>
              <p className="text-gray-400">
                Select the package manager you'd like to use for your project
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'npm', icon: SiNpm },
                { id: 'yarn', icon: SiYarn },
                { id: 'pnpm', icon: SiPnpm }
              ].map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setPackageManager(id as any)}
                  className={`
                        p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 relative
                        ${packageManager === id
                      ? 'border-orange-500 bg-orange-500/10 text-orange-400 shadow-lg shadow-orange-500/20'
                      : 'border-gray-800 bg-[#16181d] text-gray-500 hover:border-gray-700 hover:bg-gray-800/50 hover:text-gray-300'
                    }
                      `}
                >
                  {packageManager === id && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <Icon size={32} />
                  <span className="font-bold text-xl capitalize">{id}</span>
                </button>
              ))}
            </div>

            <div className="mt-12 flex justify-between">
              <button
                onClick={goBackStep}
                disabled={currentStep === 'package manager'}
                className={`
                  px-8 py-3 rounded-full font-bold text-lg transition-all
                  ${currentStep !== 'package manager'
                    ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                    : 'bg-gray-900 text-gray-700 cursor-not-allowed border border-gray-800'
                  }
                `}
              >
                ← Back
              </button>
              <button
                onClick={advanceStep}
                disabled={!canAdvance}
                className={`
                  px-8 py-3 rounded-full font-bold text-lg transition-all
                  ${canAdvance
                    ? 'bg-orange-500 text-black hover:bg-orange-400 shadow-lg shadow-orange-500/20'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }
                `}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Ingredient Selection */}
        {!isCooking && currentStep !== 'review' && currentStep !== 'package manager' && (
          <div className="mt-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentIngredients.map((ingredient: Ingredient) => (
                <IngredientCard
                  key={ingredient.id}
                  ingredient={ingredient}
                  isSelected={selectedIds.has(ingredient.id)}
                  isDisabled={isDisabled(ingredient)}
                  onToggle={toggleSelection}
                />
              ))}
            </div>

            <div className="mt-12 flex justify-between">
              <button
                onClick={goBackStep}
                className="px-8 py-3 rounded-full font-bold text-lg transition-all bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
              >
                ← Back
              </button>
              <button
                onClick={advanceStep}
                disabled={!canAdvance}
                className={`
                  px-8 py-3 rounded-full font-bold text-lg transition-all
                  ${canAdvance
                    ? 'bg-orange-500 text-black hover:bg-orange-400 shadow-lg shadow-orange-500/20'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }
                `}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Review */}
        {!isCooking && currentStep === 'review' && (
          <Summary
            selectedIngredients={selectedIngredients}
            packageManager={packageManager}
            onCook={handleCook}
            onBack={goBackStep}
            isLoading={isCooking}
          />
        )}

        {/* Live Logs */}
        {isCooking && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Cooking in progress...</h2>
              <p className="text-gray-500">
                Keep this window open until served.
              </p>
            </div>
            <TerminalLog logs={logs} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
