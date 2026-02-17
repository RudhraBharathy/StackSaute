import { Request, Response } from 'express'
import { Server } from 'socket.io'
import type { CookRequest } from '../types.js'
import type { Logger } from '../utils/logger.js'
import { checkAndCleanDirectory } from '../utils/directory.js'
import { scaffoldVite, scaffoldNext } from '../utils/scaffold.js'
import { run } from '../utils/process.js'
import { ensurePackageManager } from '../utils/packageManager.js'
import { mapPackages } from '../utils/packageMapping.js'

export function createCookRoute(io: Server, logger: Logger) {
  return async (req: Request, res: Response) => {
    const {
      framework,
      variant,
      packageManager,
      force,
      packages,
      nextConfig
    } = req.body as CookRequest

    // Validate framework
    if (!['vite', 'nextjs'].includes(framework)) {
      return res.status(400).json({ error: 'Unsupported framework' })
    }

    // Validate package manager
    if (!packageManager || !['npm', 'pnpm', 'yarn'].includes(packageManager)) {
      return res.status(400).json({ error: 'Invalid package manager' })
    }

    // Send success response immediately (don't send another response later)
    res.json({ status: 'cooking_started' })

    try {
      // Check and clean directory if needed
      checkAndCleanDirectory(force, logger.log)

      // Ensure package manager is installed
      await ensurePackageManager(packageManager, logger.log, run)

      // Scaffold project
      if (framework === 'vite') {
        await scaffoldVite(variant!, logger.log)
      }

      if (framework === 'nextjs') {
        await scaffoldNext(nextConfig, logger.log)
      }

      logger.log('Scaffold complete', 'success')

      // Install base dependencies
      logger.log(`Installing dependencies using ${packageManager}`)

      const installArgs = packageManager === 'yarn'
        ? ['install', '--ignore-engines']
        : ['install']

      await run(packageManager, installArgs, logger.log)

      // Install additional packages
      if (Array.isArray(packages) && packages.length > 0) {
        // Map packages to their modern alternatives
        let finalPackages = mapPackages(packages, framework)

        // Special handling for Tailwind with Vite
        if (framework === 'vite' && finalPackages.includes('tailwindcss')) {
          finalPackages = finalPackages.filter(p => p !== 'tailwindcss')
          finalPackages.push('tailwindcss', '@tailwindcss/vite')
          logger.log('Using official Tailwind Vite installation')
        }

        const args =
          packageManager === 'npm'
            ? ['install', ...finalPackages]
            : packageManager === 'yarn'
              ? ['add', '--ignore-engines', ...finalPackages]
              : ['add', ...finalPackages]

        await run(packageManager, args, logger.log)

        logger.log(
          `Installed extra packages: ${finalPackages.join(', ')}`,
          'success'
        )
      }

      io.emit('cooking_complete', { success: true })
      logger.log('Project ready', 'success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      logger.log(msg, 'error')
      io.emit('cooking_complete', { success: false, error: msg })
    }
  }
}
