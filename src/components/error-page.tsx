import { Button, ButtonLink } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from './ui/empty'

interface ErrorPageProps {
  error: unknown
  onRetry: () => void
}

export function ErrorPage({ error, onRetry }: ErrorPageProps) {
  const message = error instanceof Error ? error.message : String(error)

  return (
    <Card className="m-auto max-w-xl">
      <CardContent className="p-6 md:p-12 md:pb-11">
        <Empty role="alert">
          <EmptyHeader>
            <EmptyTitle>Something short-circuited</EmptyTitle>
            <EmptyDescription>
              The page hit an unexpected error. Try it again, or return to the homepage if the
              problem keeps happening.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button onClick={onRetry}>Try again</Button>
              <ButtonLink to="/">Start over</ButtonLink>
            </div>
            {import.meta.env.DEV ? (
              <details className="w-full text-left">
                <summary className="cursor-pointer font-medium">Technical details</summary>
                <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-muted p-3 font-mono text-xs wrap-break-word whitespace-pre-wrap">
                  {message}
                </pre>
              </details>
            ) : null}
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
