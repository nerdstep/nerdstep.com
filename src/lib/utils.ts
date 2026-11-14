import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// The `type-*` role utilities (index.css) each set size, weight, line height,
// and tracking. Tell tailwind-merge so a role passed to a component replaces
// its default text classes instead of losing to them on CSS order.
const twMerge = extendTailwindMerge<'type-role'>({
  extend: {
    classGroups: {
      'type-role': [{ type: ['label', 'meta', 'name', 'title', 'prose'] }],
    },
    conflictingClassGroups: {
      'type-role': ['font-size', 'font-weight', 'leading', 'tracking'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
