import React from 'react'
import { createPortal } from 'react-dom'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}

export const ForceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}) => {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose()
    }
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#161b22] border-2 border-red-500/50 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl animate-fade-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400">
            Force Clear Directory
          </h2>
        </div>

        <div className="mb-6 space-y-3 text-gray-300">
          <p className="text-base">
            This will <span className="font-bold text-red-400">permanently delete</span> all existing files in the target directory before creating your new project.
          </p>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-sm font-semibold text-red-300 mb-2">
              ⚡ What will happen:
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>All files in the directory will be removed</li>
              <li>Fresh project will be initialized</li>
              <li>All packages will be installed from scratch</li>
            </ul>
          </div>

          <p className="text-sm text-yellow-400 font-medium">
            ⚠️ This action cannot be undone!
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-lg font-semibold bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${isLoading
                ? 'bg-gray-800 text-gray-500 cursor-wait'
                : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30'
              }`}
          >
            {isLoading ? 'Processing...' : 'Force Clear & Cook 🔥'}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
