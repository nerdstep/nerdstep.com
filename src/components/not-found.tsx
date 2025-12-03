import type { ReactNode } from 'react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button, ButtonLink } from './ui/button'
import { Card, CardContent } from './ui/card'

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <Card className="m-auto max-w-xl">
      <CardContent className="p-6 md:p-12 md:pb-11">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>404 - Not Found</EmptyTitle>
            <EmptyDescription>
              {children || <p>The page you are looking for does not exist.</p>}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <p className="flex flex-wrap items-center gap-2">
              <Button onClick={() => window.history.back()}>Go back</Button>
              <ButtonLink to="/">Start Over</ButtonLink>
            </p>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
