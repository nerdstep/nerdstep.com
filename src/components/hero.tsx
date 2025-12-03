import { motion } from 'motion/react'
import { ProfilePicture } from './profile-picture'
import { Card, CardContent } from './ui/card'

export function Hero() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  } as const

  return (
    <Card className="m-auto max-w-xl bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6 text-center md:p-12 md:pb-11">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.4 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.5,
                },
              },
            }}
          >
            <ProfilePicture />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="my-4 font-bold text-3xl leading-tight tracking-tight md:text-4xl"
          >
            Software engineer, outdoor enthusiast, cat dad.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="font-medium text-2xl text-muted-foreground"
          >
            Perpetually Under Construction
          </motion.p>
        </motion.div>
      </CardContent>
    </Card>
  )
}
