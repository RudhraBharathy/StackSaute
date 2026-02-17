import { Server } from 'socket.io'
import chalk from 'chalk'
import type { LogType } from '../types.js'

export interface Logger {
  log: (message: string, type?: LogType) => void
}

export function createLogger(io: Server): Logger {
  return {
    log(message: string, type: LogType = 'info') {
      const stamp = new Date().toLocaleTimeString()
      const line = `[${stamp}] ${message}`

      const color = {
        info: chalk.blue,
        success: chalk.green,
        error: chalk.red,
        warn: chalk.yellow
      }[type]

      console.log(color(line))
      io.emit('log', { message: line, type })
    }
  }
}
