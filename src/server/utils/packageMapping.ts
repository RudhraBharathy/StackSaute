/**
 * Package mapping configuration for replacing deprecated or CLI packages
 * with their modern, framework-specific alternatives
 */

interface PackageMapping {
  /** The package name that will be installed */
  install: string | string[]
  /** Optional: Only apply this mapping for specific frameworks */
  frameworks?: ('vite' | 'nextjs')[]
}

/**
 * Centralized package mapping configuration
 * Add new mappings here to keep the system maintainable and scalable
 */
export const PACKAGE_MAPPINGS: Record<string, PackageMapping> = {
  // Backend/Database
  'supabase': {
    install: '@supabase/supabase-js'
  },
  'firebase': {
    install: 'firebase'
  },
  // Note: Prisma removed due to strict Node.js version requirements

  // Authentication
  'clerk': {
    install: '@clerk/clerk-react'
  },

  // State Management
  'zustand': {
    install: 'zustand'
  },
  'redux': {
    install: ['@reduxjs/toolkit', 'react-redux']
  },
  'tanstack': {
    install: '@tanstack/react-query'
  },

  // Styling
  'tailwindcss': {
    install: 'tailwindcss',
    frameworks: ['vite', 'nextjs']
  },
  'sass': {
    install: 'sass'
  },
  'styled-components': {
    install: 'styled-components'
  },
}

/**
 * Maps a package name to its modern alternative(s) based on framework
 * @param packageName - The original package name
 * @param framework - The framework being used (vite or nextjs)
 * @returns The mapped package name(s) or the original if no mapping exists
 */
export function mapPackageName(
  packageName: string,
  framework?: 'vite' | 'nextjs'
): string | string[] {
  const mapping = PACKAGE_MAPPINGS[packageName]

  if (!mapping) {
    // No mapping exists, return original package name
    return packageName
  }

  // Check if mapping is framework-specific
  if (mapping.frameworks && framework) {
    if (!mapping.frameworks.includes(framework)) {
      // Mapping doesn't apply to this framework
      return packageName
    }
  }

  return mapping.install
}

/**
 * Maps an array of package names to their modern alternatives
 * @param packages - Array of package names
 * @param framework - The framework being used
 * @returns Flattened array of mapped package names
 */
export function mapPackages(
  packages: string[],
  framework?: 'vite' | 'nextjs'
): string[] {
  const mapped = packages.map(pkg => mapPackageName(pkg, framework))
  // Flatten in case any mapping returns an array of packages
  return mapped.flat()
}

/**
 * Get all available package mappings for documentation/debugging
 */
export function getAllMappings(): Record<string, PackageMapping> {
  return PACKAGE_MAPPINGS
}

