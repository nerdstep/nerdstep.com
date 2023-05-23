import { ProfilePicture } from './profile-picture'
import { Card, CardContent } from './ui/card'

export function Hero() {
  return (
    <Card className="m-auto max-w-xl">
      <CardContent className="p-6 text-center md:p-12 md:pb-11">
        <ProfilePicture />
        <h1 className="my-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          Software engineer, outdoor enthusiast, cat dad.
        </h1>
        <p className="text-2xl font-medium text-muted-foreground">
          Under Construction
        </p>
      </CardContent>
    </Card>
  )
}
