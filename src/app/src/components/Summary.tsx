import React from 'react'
import { SiNpm, SiYarn, SiPnpm } from 'react-icons/si'
import type { Ingredient } from '../constants/ingredients.js'

interface Props {
	selectedIngredients: Ingredient[]
	packageManager: 'npm' | 'yarn' | 'pnpm'
	force: boolean
	onForceChange: (force: boolean) => void
	onCook: () => void
	onBack: () => void
	isLoading: boolean
}

export const Summary: React.FC<Props> = ({
	selectedIngredients,
	packageManager,
	force,
	onForceChange,
	onCook,
	onBack,
	isLoading
}) => {
	const foundation = selectedIngredients.find(
		i => i.category === 'foundation'
	)

	const baseItems = selectedIngredients.filter(i => {
		if (i.category === 'foundation') return true

		if (
			foundation?.id === 'nextjs' &&
			i.category === 'nextConfig' &&
			(i.id === 'eslint' || i.id === 'srcDir')
		) {
			return true
		}

		if (
			foundation?.id === 'vite' &&
			i.category === 'viteTemplate'
		) {
			return true
		}

		return false
	})

	const ingredientItems = selectedIngredients.filter(i => {
		return !baseItems.includes(i)
	})

	const packageManagerIcons = {
		npm: SiNpm,
		yarn: SiYarn,
		pnpm: SiPnpm
	}

	const PackageManagerIcon = packageManagerIcons[packageManager]

	return (
		<div className="max-w-2xl mx-auto w-full animate-fade-up">
			<h2 className="text-2xl font-bold mb-6 text-center">
				Ready to Cook?
			</h2>

			<div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 mb-8">
				<div className="mb-6">
					<h3 className="text-gray-500 text-sm uppercase tracking-wider mb-3">
						Package Manager
					</h3>

					<span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-medium border border-blue-500/30 flex items-center gap-2 w-fit">
						<PackageManagerIcon size={16} />
						{packageManager}
					</span>
				</div>

				<div className="mb-6">
					<h3 className="text-gray-500 text-sm uppercase tracking-wider mb-3">
						Base
					</h3>

					<div className="flex flex-wrap gap-2">
						{baseItems.map(i => (
							<span
								key={i.id}
								className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-medium border border-orange-500/30 flex items-center gap-2"
							>
								<span className="text-lg">{i.icon}</span>
								{i.name}
							</span>
						))}
					</div>
				</div>

				<div>
					<h3 className="text-gray-500 text-sm uppercase tracking-wider mb-3">
						Ingredients
					</h3>

					<div className="flex flex-wrap gap-2">
						{ingredientItems.length > 0 ? (
							ingredientItems.map(i => (
								<span
									key={i.id}
									className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-700 flex items-center gap-2"
								>
									<span className="text-xs">{i.icon}</span>
									{i.name}
								</span>
							))
						) : (
							<span className="text-gray-600 italic">
								None selected
							</span>
						)}
					</div>
				</div>
			</div>

			<div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
				<label className="flex items-start gap-3 cursor-pointer group">
					<input
						type="checkbox"
						checked={force}
						onChange={(e) => onForceChange(e.target.checked)}
						className="mt-1 w-5 h-5 rounded border-yellow-500/50 bg-yellow-500/10 text-yellow-500 focus:ring-2 focus:ring-yellow-500/50 cursor-pointer"
					/>
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<span className="text-yellow-400 font-semibold">⚠️ Force Clear Directory</span>
						</div>
						<p className="text-sm text-gray-400">
							Delete all existing files in the target directory before creating the project.
							<span className="text-yellow-300 font-medium"> Use with caution!</span>
						</p>
					</div>
				</label>
			</div>

			<div className="flex gap-4">
				<button
					onClick={onBack}
					className="px-8 py-4 rounded-xl font-bold text-lg bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
				>
					← Back
				</button>

				<button
					onClick={onCook}
					disabled={isLoading}
					className={`
            flex-1 py-4 rounded-xl font-bold text-lg tracking-wide transition-all
            ${isLoading
							? 'bg-gray-800 text-gray-500 cursor-wait'
							: 'bg-linear-to-r from-orange-600 to-red-600 text-white hover:shadow-xl hover:scale-[1.02]'
						}
          `}
				>
					{isLoading ? 'Cooking...' : 'Start Cooking 🔥'}
				</button>
			</div>
		</div>
	)
}
