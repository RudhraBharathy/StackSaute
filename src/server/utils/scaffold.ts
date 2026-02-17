import type { NextConfig } from '../types.js'
import type { Logger } from './logger.js'
import { run } from './process.js'

export async function scaffoldVite(
  variant: string,
  log: Logger['log']
): Promise<void> {
  const template = getViteTemplate(variant)

  log(`Scaffolding Vite project with template: ${template}`)

  await run('npx', [
    'create-vite@latest',
    '.',
    '--template',
    template,
    '--no-interactive'
  ], log)
}

export async function scaffoldNext(
  nextConfig: NextConfig | undefined,
  log: Logger['log']
): Promise<void> {
  log('Scaffolding Next.js project')

  const {
    typescript = true,
    eslint = true,
    tailwind = false,
    srcDir = false
  } = nextConfig || {}

  const args = [
    'create-next-app@latest',
    '.',
    typescript ? '--typescript' : '--js',
    eslint ? '--eslint' : '--no-eslint',
    tailwind ? '--tailwind' : '',
    srcDir ? '--src-dir' : '',
    '--app',
    '--import-alias',
    '@/*',
    '--no-interactive'
  ].filter(Boolean)

  await run('npx', args, log)
}

export function getViteTemplate(variant: string): string {
  const validTemplates = [
    'react',
    'react-ts',
    'vue',
    'vue-ts'
  ]

  if (!validTemplates.includes(variant)) {
    throw new Error(`Invalid Vite template: ${variant}`)
  }

  return variant
}
