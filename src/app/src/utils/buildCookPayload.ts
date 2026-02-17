import type { Ingredient } from '../constants/ingredients.js'

type PackageManager = 'npm' | 'yarn' | 'pnpm'

interface CookPayload {
  framework: string | undefined
  packageManager: PackageManager
  force: boolean
  variant?: string
  nextConfig?: {
    typescript: boolean
    eslint: boolean
    tailwind: boolean
    srcDir: boolean
  }
  packages: string[]
}

export function buildCookPayload(
  selectedIngredients: Ingredient[],
  packageManager: PackageManager,
  force: boolean
): CookPayload {
  const foundation = selectedIngredients.find(
    (i: Ingredient) => i.category === 'foundation'
  )

  const payload: CookPayload = {
    framework: foundation?.id,
    packageManager,
    force,
    packages: []
  }

  // Handle Vite template
  if (foundation?.id === 'vite') {
    const template = selectedIngredients.find(
      (i: Ingredient) => i.category === 'viteTemplate'
    )
    payload.variant = template?.id
  }

  // Handle Next.js configuration
  if (foundation?.id === 'nextjs') {
    const nextSelections = selectedIngredients.filter(
      (i: Ingredient) => i.category === 'nextConfig'
    )

    payload.nextConfig = {
      typescript: nextSelections.some(i => i.id === 'typescript'),
      eslint: nextSelections.some(i => i.id === 'eslint'),
      tailwind: nextSelections.some(i => i.id === 'tailwind'),
      srcDir: nextSelections.some(i => i.id === 'srcDir')
    }
  }

  // Filter and map packages
  payload.packages = selectedIngredients
    .filter(
      (i: Ingredient) =>
        i.category !== 'foundation' &&
        i.category !== 'viteTemplate' &&
        i.category !== 'nextConfig'
    )
    .map((i: Ingredient) => i.id)

  return payload
}
