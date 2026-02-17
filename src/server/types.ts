export interface CookRequest {
  framework: 'vite' | 'nextjs'
  variant?: string
  packageManager: 'npm' | 'yarn' | 'pnpm'
  force?: boolean
  packages?: string[]
  nextConfig?: NextConfig
}

export interface NextConfig {
  typescript?: boolean
  eslint?: boolean
  tailwind?: boolean
  srcDir?: boolean
}

export type LogType = 'info' | 'success' | 'error' | 'warn'
