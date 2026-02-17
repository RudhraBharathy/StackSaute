import { execSync } from 'child_process'
import type { Logger } from './logger.js'

export function isPackageManagerInstalled(pm: 'npm' | 'yarn' | 'pnpm'): boolean {
  try {
    execSync(`${pm} --version`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

export async function ensurePackageManager(
  pm: 'npm' | 'yarn' | 'pnpm',
  log: Logger['log'],
  run: (cmd: string, args: string[], onLog: Logger['log']) => Promise<void>
): Promise<void> {
  if (pm === 'npm') {
    // npm is always available with Node.js
    return
  }

  if (isPackageManagerInstalled(pm)) {
    return
  }

  log(`${pm} is not installed on this system. Installing ${pm}...`, 'warn')

  const installCmd = pm === 'yarn'
    ? ['install', '--global', 'yarn']
    : ['install', '-g', 'pnpm']

  await run('npm', installCmd, log)

  log(`${pm} installed successfully`, 'success')
}
