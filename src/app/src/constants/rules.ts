export const RULES = {
  exclusions: {
    tailwindcss: ['styled-components'],
    'styled-components': ['tailwindcss'],
    nextjs: ['react-router-dom']
  },
  dependencies: {
    supabase: ['zod']
  }
} as const
