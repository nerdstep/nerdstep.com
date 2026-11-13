import Tilt from 'react-parallax-tilt'

import { cn } from '@/lib/utils'

export function ProfilePicture({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center select-none">
      <Tilt
        className={cn(
          "h-64 w-64 rounded-full border-2 border-gray-600 bg-[url('/img/profile-bg.png')] bg-contain bg-no-repeat shadow-[inset_0_0_0_4px_rgba(255,255,255,1)] transform-3d dark:border-slate-300 dark:shadow-[inset_0_0_0_4px_rgba(15,23,42,1)]",
          className,
        )}
        glareBorderRadius="9999px"
        glareColor="#ffffff"
        glareEnable={true}
        glareMaxOpacity={0.35}
        glarePosition="all"
        gyroscope={false}
        perspective={1000}
        scale={1}
        tiltEnable={true}
        tiltMaxAngleX={10}
        tiltMaxAngleY={20}
        transitionSpeed={1500}
      >
        <img
          alt="profile"
          className="tilt rounded-full"
          height="100%"
          src="/img/profile-fg.png"
          width="100%"
        />
      </Tilt>
    </div>
  )
}
