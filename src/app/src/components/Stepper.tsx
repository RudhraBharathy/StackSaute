import React from 'react'
import type { Step } from '../hooks/useSelection'

interface Props {
	steps: Step[]
	currentStep: Step
}

export const Stepper: React.FC<Props> = ({
	steps,
	currentStep,
}) => {
	const currentIndex = steps.indexOf(currentStep)

	const getStepLabel = (step: Step): string => {
		switch (step) {
			case 'package manager':
				return 'PACKAGE MANAGER'
			case 'foundation':
				return 'FOUNDATION'
			case 'viteTemplate':
				return 'VITE TEMPLATE'
			case 'nextConfig':
				return 'NEXT JS CONFIG'
			case 'styling':
				return 'STYLING'
			case 'state':
				return 'STATE MANAGEMENT'
			case 'backend':
				return 'BACKEND'
			case 'review':
				return 'REVIEW'
		}

		const _exhaustive: never = step
		return _exhaustive
	}

	return (
		<div className="flex items-center justify-center w-full mx-auto mb-12 pb-6 max-w-4xl">
			{steps.map((step, idx) => {
				const isCompleted = idx < currentIndex
				const isCurrent = idx === currentIndex

				return (
					<React.Fragment key={step}>
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

							<div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-medium uppercase tracking-wider whitespace-nowrap text-gray-400 text-xs">
								{getStepLabel(step)}
							</div>
						</div>

						{idx < steps.length - 1 && (
							<div className="flex-1 h-0.5 mx-1.5 bg-gray-800 relative w-12 md:w-28">
								<div
									className={`absolute inset-0 bg-orange-500 transition-all duration-500 ${idx < currentIndex ? 'w-full' : 'w-0'
										}`}
								/>
							</div>
						)}
					</React.Fragment>
				)
			})}
		</div>
	)
}
