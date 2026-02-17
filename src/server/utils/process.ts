import { spawn } from 'child_process'
import type { LogType } from '../types.js'

/**
 * Patterns to filter out from logs to reduce noise
 */
const LOG_FILTERS = [
  /^info All dependencies$/,           // Yarn dependency list header
  /^├─/,                                // Yarn dependency tree items
  /^└─/,                                // Yarn dependency tree items
  /^info Direct dependencies$/,         // Yarn direct deps header
  /^warning .* has unmet peer dependency/, // Peer dependency warnings
]

/**
 * Check if a log line should be filtered out
 */
function shouldFilterLog(line: string): boolean {
  return LOG_FILTERS.some(pattern => pattern.test(line))
}

export function run(
  cmd: string,
  args: string[],
  onLog: (message: string, type?: LogType) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })

    p.stdout.on('data', d =>
      d
        .toString()
        .split('\n')
        .filter(Boolean)
        .filter((line: string) => !shouldFilterLog(line))
        .forEach((l: string) => onLog(l))
    )

    p.stderr.on('data', d =>
      d
        .toString()
        .split('\n')
        .filter(Boolean)
        .filter((line: string) => !shouldFilterLog(line))
        .forEach((l: string) => onLog(l, 'warn'))
    )

    p.on('close', c =>
      c === 0 ? resolve() : reject(new Error(`Exit ${c}`))
    )
    p.on('error', reject)
  })
}
