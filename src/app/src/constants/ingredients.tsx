import React from 'react'
import {
  SiTailwindcss,
  SiSupabase,
  SiReactquery,
  SiVite,
  SiNextdotjs,
  SiPrisma,
  SiStyledcomponents,
  SiSass,
  SiRedux,
  SiFirebase,
  SiClerk,
  SiRadixui,
  SiReact
} from 'react-icons/si'

export type Category =
  | 'foundation'
  | 'styling'
  | 'state'
  | 'backend'
  | 'utility'

export interface Ingredient {
  id: string
  name: string
  icon: React.ReactNode
  category: Category
  frameworks?: string[]
  exclusiveGroup?: string
  description: string
}

export const INGREDIENTS: Ingredient[] = [
  {
    id: 'vite',
    name: 'Vite (React)',
    icon: <SiVite size={24} />,
    category: 'foundation',
    exclusiveGroup: 'framework',
    frameworks: ['react'],
    description: 'Next Generation Frontend Tooling'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: <SiNextdotjs size={24} />,
    category: 'foundation',
    exclusiveGroup: 'framework',
    frameworks: ['nextjs'],
    description: 'The React Framework for the Web'
  },

  {
    id: 'tailwindcss',
    name: 'Tailwind CSS',
    icon: <SiTailwindcss size={24} />,
    category: 'styling',
    exclusiveGroup: 'css-framework',
    description: 'A utility-first CSS framework'
  },
  {
    id: 'styled-components',
    name: 'Styled Components',
    icon: <SiStyledcomponents size={24} />,
    category: 'styling',
    exclusiveGroup: 'css-framework',
    description: 'Visual primitives for the component age'
  },
  {
    id: 'sass',
    name: 'Sass',
    icon: <SiSass size={24} />,
    category: 'styling',
    description: 'CSS with superpowers'
  },
  {
    id: 'shadcn-ui',
    name: 'Shadcn UI',
    icon: <SiRadixui size={24} />,
    category: 'styling',
    description: 'Beautifully designed components'
  },

  {
    id: 'zustand',
    name: 'Zustand',
    icon: <SiReact size={24} />,
    category: 'state',
    description: 'Small, fast, and scalable state management'
  },
  {
    id: 'redux-toolkit',
    name: 'Redux Toolkit',
    icon: <SiRedux size={24} />,
    category: 'state',
    description: 'The standard way to write Redux'
  },
  {
    id: 'react-query',
    name: 'TanStack Query',
    icon: <SiReactquery size={24} />,
    category: 'state',
    description: 'Powerful asynchronous state management'
  },

  {
    id: 'supabase',
    name: 'Supabase',
    icon: <SiSupabase size={24} />,
    category: 'backend',
    description: 'The open source Firebase alternative'
  },
  {
    id: 'firebase',
    name: 'Firebase',
    icon: <SiFirebase size={24} />,
    category: 'backend',
    description: 'Google mobile and web platform'
  },
  {
    id: 'clerk',
    name: 'Clerk',
    icon: <SiClerk size={24} />,
    category: 'backend',
    description: 'Authentication made simple'
  },
  {
    id: 'prisma',
    name: 'Prisma',
    icon: <SiPrisma size={24} />,
    category: 'backend',
    description: 'Next-generation ORM'
  }
]
