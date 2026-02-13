import React from 'react';
import type { Step } from '../hooks/useSelection.js';

interface Props {
	steps: Step[];
	currentStep: Step;
}

export const Stepper: React.FC<Props> = ({ steps, currentStep }) => {
	const currentIndex = steps.indexOf(currentStep);

	return (
		<div className="flex items-center justify-center w-full max-w-2xl mx-auto mb-12 pb-6">
			{steps.map((step, idx) => {
				const isCompleted = idx < currentIndex;
				const isCurrent = idx === currentIndex;

				return (
					<React.Fragment key={step}>
						{/* Circle */}
						<div className="relative z-10">
							<div
								className={`
				  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-500
				  ${isCompleted || isCurrent
										? 'border-orange-500 bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.5)]'
										: 'border-gray-700 bg-gray-900 text-gray-500'
									}
				`}
							>
								{idx + 1}
							</div>
							<div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-wider whitespace-nowrap text-gray-400">
								{step}
							</div>
						</div>

						{/* Connecting Line */}
						{idx < steps.length - 1 && (
							<div className="flex-1 h-0.5 mx-2 bg-gray-800 relative w-12 md:w-24">
								<div
									className={`absolute inset-0 bg-orange-500 transition-all duration-500 ${idx < currentIndex ? 'w-full' : 'w-0'}`}
								/>
							</div>
						)}
					</React.Fragment>
				);
			})}
		</div>
	);
};
