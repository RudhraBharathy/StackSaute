import React from 'react';
import type { Ingredient } from '../constants/ingredients.js';

interface Props {
  ingredient: Ingredient;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (id: string) => void;
}

export const IngredientCard: React.FC<Props> = ({ ingredient, isSelected, isDisabled, onToggle }) => {
  const handleClick = () => {
    if (!isDisabled) {
      onToggle(ingredient.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        p-6 rounded-xl border-2 transition-all duration-300 text-left h-full group
        flex flex-col gap-4 relative overflow-hidden
        ${isDisabled
          ? 'border-gray-800 bg-gray-900/50 opacity-40 cursor-not-allowed'
          : 'cursor-pointer ' + (isSelected
            ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.2)]'
            : 'border-gray-800 bg-gray-900 hover:border-gray-600 hover:bg-gray-800')
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div className={`text-3xl ${isSelected ? 'text-orange-500' : 'text-gray-400 group-hover:text-white'}`}>
          {ingredient.icon}
        </div>
        {isSelected && (
          <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      <div>
        <h3 className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
          {ingredient.name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {ingredient.description}
        </p>
      </div>

      {isDisabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs font-mono text-gray-300 bg-black/80 px-2 py-1 rounded border border-gray-700">
            Not compatible
          </span>
        </div>
      )}
    </div>
  );
};
