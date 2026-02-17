import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

interface UseSocketParams {
  onLog: (log: { message: string; type: string }) => void
  onComplete: (data: { success: boolean; error?: string }) => void
}

export function useSocket({ onLog, onComplete }: UseSocketParams) {
  const onLogRef = useRef(onLog)
  const onCompleteRef = useRef(onComplete)

  // Update refs when callbacks change
  useEffect(() => {
    onLogRef.current = onLog
  }, [onLog])

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const socket = io({
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
    })

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    socket.on('log', (log: { message: string; type: string }) => {
      onLogRef.current(log)
    })

    socket.on(
      'cooking_complete',
      (data: { success: boolean; error?: string }) => {
        console.log('Cooking complete event received:', data)
        onCompleteRef.current(data)
      }
    )

    return () => {
      socket.off('log')
      socket.off('cooking_complete')
      socket.disconnect()
    }
  }, []) // Empty dependency array - socket only connects once
}
