import React from 'react';
import type { Ingredient } from '../constants/ingredients.js';

interface Props {
	selectedIngredients: Ingredient[];
	onCook: () => void;
	isLoading: boolean;
}

export const Summary: React.FC<Props> = ({ selectedIngredients, onCook, isLoading }) => {
	// Group by category
	const groups = {
		foundation: selectedIngredients.filter(i => i.category === 'foundation'),
		other: selectedIngredients.filter(i => i.category !== 'foundation')
	};

	return (
		<div className="max-w-2xl mx-auto w-full animate-fade-up">
			<h2 className="text-2xl font-bold mb-6 text-center">Ready to Cook?</h2>

			<div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 mb-8">
				<div className="mb-6">
					<h3 className="text-gray-500 text-sm uppercase tracking-wider mb-3">Base</h3>
					<div className="flex gap-2">
						{groups.foundation.map(i => (
							<span key={i.id} className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-medium border border-orange-500/30">
								{i.name}
							</span>
						))}
					</div>
				</div>

				<div>
					<h3 className="text-gray-500 text-sm uppercase tracking-wider mb-3">Ingredients</h3>
					<div className="flex flex-wrap gap-2">
						{groups.other.length > 0 ? groups.other.map(i => (
							<span key={i.id} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-700">
								{i.name}
							</span>
						)) : <span className="text-gray-600 italic">None selected</span>}
					</div>
				</div>
			</div>

			<button
				onClick={onCook}
				disabled={isLoading}
				className={`
			w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all
			${isLoading
						? 'bg-gray-800 text-gray-500 cursor-wait'
						: 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-xl hover:scale-[1.02]'
					}
		`}
			>
				{isLoading ? 'Cooking...' : 'Start Cooking 🔥'}
			</button>

			<p className="text-center text-gray-500 text-sm mt-4">
				This will initialize a new project in your current directory. A terminal will be spawned to run the commands.
			</p>
		</div>
	);
};
