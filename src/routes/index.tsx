import { createFileRoute } from '@tanstack/react-router'
import { isString } from 'es-toolkit'

import { Honeycomb } from '@/components/honeycomb'

interface HomeSearch {
  /** `?p=<slug>` deep-links an open project detail dialog. */
  p?: string
}

const validateSearch = (search: Record<string, unknown>): HomeSearch => ({
  p: isString(search.p) ? search.p : undefined,
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
  validateSearch,
})
