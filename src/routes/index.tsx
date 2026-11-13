import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { Honeycomb } from '@/components/honeycomb'

// `?p=<slug>` deep-links an open project detail dialog.
const searchSchema = z.object({
  p: z.string().optional(),
})

function Home() {
  return (
    <section className="flex w-full items-center justify-center">
      <Honeycomb />
    </section>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
  validateSearch: searchSchema,
})
