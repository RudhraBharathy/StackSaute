import React from 'react'
import { TerminalLog } from './TerminalLog'

interface Props {
  logs: Array<{ message: string; type: string }>
  error?: string
  isCookingComplete?: boolean
}

export const CookingView: React.FC<Props> = ({ logs, error, isCookingComplete = false }) => {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          {isCookingComplete
            ? 'Cooking done! Now you can close the window or terminal to stop the server.'
            : 'Cooking in progress...'
          }
        </h2>
      </div>
      <TerminalLog logs={logs} error={error} />
    </div>
  )
}
