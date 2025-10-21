import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/hero'

function Home() {
  return (
    <section className="flex w-full">
      <Hero />
    </section>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
})
