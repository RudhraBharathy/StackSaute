import fs from 'fs'
import path from 'path'
import type { LogType } from '../types.js'

export function checkAndCleanDirectory(
  force: boolean | undefined,
  log: (message: string, type?: LogType) => void
): void {
  const files = fs.readdirSync(process.cwd())

  if (files.length === 0) return

  if (!force) {
    throw new Error('Directory not empty. Use force option to overwrite.')
  }

  log('Directory not empty. Removing existing files...', 'warn')

  for (const file of files) {
    const fullPath = path.join(process.cwd(), file)
    fs.rmSync(fullPath, { recursive: true, force: true })
  }

  log('Directory cleaned', 'success')
}
