import React from 'react'
import { SiNpm, SiYarn, SiPnpm } from 'react-icons/si'

type PackageManager = 'npm' | 'yarn' | 'pnpm'

const PACKAGE_MANAGERS: { id: PackageManager; icon: React.ElementType }[] = [
  { id: 'npm', icon: SiNpm },
  { id: 'yarn', icon: SiYarn },
  { id: 'pnpm', icon: SiPnpm }
]

interface Props {
  packageManager: PackageManager
  setPackageManager: (pm: PackageManager) => void
  onContinue: () => void
  canAdvance: boolean
}

export const PackageManagerStep: React.FC<Props> = ({
  packageManager,
  setPackageManager,
  onContinue,
  canAdvance
}) => {
  return (
    <div className="mt-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">
          Choose Your Package Manager
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {PACKAGE_MANAGERS.map(({ id, icon: Icon }) => {
          const isActive = packageManager === id

          return (
            <button
              key={id}
              onClick={() => setPackageManager(id)}
              className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 ${isActive
                ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                : 'border-gray-800 bg-[#16181d] text-gray-400'
                }`}
            >
              <Icon size={32} />
              <span className="font-bold text-xl capitalize">
                {id}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-12 flex justify-between">
        <button
          disabled
          className="px-8 py-3 rounded-full bg-gray-900 text-gray-700 border border-gray-800"
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
