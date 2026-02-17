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
  SiReact,
  SiVuedotjs,
  SiTypescript,
  SiJavascript,
  SiEslint
} from 'react-icons/si'

const CombinedIcon = ({ icons }: { icons: React.ReactNode[] }) => (
  <div className="flex items-center gap-1">
    {icons.map((icon, idx) => (
      <div key={idx}>{icon}</div>
    ))}
  </div>
)

export type Category =
  | 'foundation'
  | 'viteTemplate'
  | 'nextConfig'
  | 'styling'
  | 'state'
  | 'backend'

export interface Ingredient {
  id: string
  name: string
  icon: React.ReactNode
  category: Category
  exclusiveGroup?: string
  description: string
}

export const INGREDIENTS: Ingredient[] = [
  // =====================
  // Foundation
  // =====================
  {
    id: 'vite',
    name: 'Vite',
    icon: <SiVite size={24} />,
    category: 'foundation',
    exclusiveGroup: 'framework',
    description: 'Next Generation Frontend Tooling'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: <SiNextdotjs size={24} />,
    category: 'foundation',
    exclusiveGroup: 'framework',
    description: 'The React Framework for the Web'
  },

  // =====================
  // Vite Templates
  // =====================
  {
    id: 'react',
    name: 'React + JavaScript',
    icon: (
      <CombinedIcon
        icons={[<SiReact size={24} />, <SiJavascript size={24} />]}
      />
    ),
    category: 'viteTemplate',
    exclusiveGroup: 'vite-template',
    description: 'React with JavaScript'
  },
  {
    id: 'react-ts',
    name: 'React + TypeScript',
    icon: (
      <CombinedIcon
        icons={[<SiReact size={24} />, <SiTypescript size={24} />]}
      />
    ),
    category: 'viteTemplate',
    exclusiveGroup: 'vite-template',
    description: 'React with TypeScript'
  },
  {
    id: 'vue',
    name: 'Vue + JavaScript',
    icon: (
      <CombinedIcon
        icons={[<SiVuedotjs size={24} />, <SiJavascript size={24} />]}
      />
    ),
    category: 'viteTemplate',
    exclusiveGroup: 'vite-template',
    description: 'Vue with JavaScript'
  },
  {
    id: 'vue-ts',
    name: 'Vue + TypeScript',
    icon: (
      <CombinedIcon
        icons={[<SiVuedotjs size={24} />, <SiTypescript size={24} />]}
      />
    ),
    category: 'viteTemplate',
    exclusiveGroup: 'vite-template',
    description: 'Vue with TypeScript'
  },

  // =====================
  // Next.js Configuration
  // =====================
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: <SiTypescript size={24} />,
    category: 'nextConfig',
    exclusiveGroup: 'next-types',
    description: 'Enable TypeScript support'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: <SiJavascript size={24} />,
    category: 'nextConfig',
    exclusiveGroup: 'next-types',
    description: 'Use JavaScript instead of TypeScript'
  },
  {
    id: 'eslint',
    name: 'ESLint',
    icon: <SiEslint size={24} />,
    category: 'nextConfig',
    description: 'Enable ESLint configuration'
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    icon: <SiTailwindcss size={24} />,
    category: 'nextConfig',
    description: 'Setup Tailwind automatically'
  },
  {
    id: 'srcDir',
    name: 'Use src/ Directory',
    icon: <SiNextdotjs size={24} />,
    category: 'nextConfig',
    description: 'Create project inside src folder'
  },

  // =====================
  // Styling
  // =====================
  {
    id: 'tailwindcss',
    name: 'Tailwind CSS',
    icon: <SiTailwindcss size={24} />,
    category: 'styling',
    exclusiveGroup: 'css-framework',
    description: 'Utility-first CSS framework'
  },
  {
    id: 'styled-components',
    name: 'Styled Components',
    icon: <SiStyledcomponents size={24} />,
    category: 'styling',
    exclusiveGroup: 'css-framework',
    description: 'Visual primitives for components'
  },
  {
    id: 'sass',
    name: 'Sass',
    icon: <SiSass size={24} />,
    category: 'styling',
    description: 'CSS with superpowers'
  },

  // =====================
  // State
  // =====================
  {
    id: 'zustand',
    name: 'Zustand',
    icon: <SiReact size={24} />,
    category: 'state',
    exclusiveGroup: 'state-management',
    description: 'Small and scalable state management'
  },
  {
    id: 'redux-toolkit',
    name: 'Redux Toolkit',
    icon: <SiRedux size={24} />,  
    category: 'state',
    exclusiveGroup: 'state-management',
    description: 'Standard Redux setup'
  },
  {
    id: 'react-query',
    name: 'TanStack Query',
    icon: <SiReactquery size={24} />,
    category: 'state',
    exclusiveGroup: 'state-management',
    description: 'Async state management'
  },

  // =====================
  // Backend
  // =====================
  {
    id: 'supabase',
    name: 'Supabase',
    icon: <SiSupabase size={24} />,
    category: 'backend',
    description: 'Open source Firebase alternative'
  },
  {
    id: 'firebase',
    name: 'Firebase',
    icon: <SiFirebase size={24} />,
    category: 'backend',
    description: 'Google web platform'
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
