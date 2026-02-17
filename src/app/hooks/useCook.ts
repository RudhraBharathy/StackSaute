import { useState } from 'react'
import { cookProject } from '../services/cookProject'

export function useCook() {
  const [error, setError] = useState<string>()
  const [isCooking, setIsCooking] = useState(false)

  async function startCooking(payload: any) {
    setIsCooking(true)
    setError(undefined)

    try {
      await cookProject(payload)
    } catch (err) {
      setIsCooking(false)
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return {
    startCooking,
    error,
    isCooking,
    setIsCooking
  }
}
