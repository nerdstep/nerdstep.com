'use client'
import Tilt from 'react-parallax-tilt'

export function ProfilePicture() {
  return (
    <div className="flex items-center justify-center">
      <Tilt
        className="h-64 w-64 rounded-full border-2 border-gray-600 bg-[url('/img/profile-bg.png')] bg-contain bg-no-repeat shadow-[inset_0_0_0_4px_rgba(255,255,255,1)] [transform-style:preserve-3d] dark:border-slate-300 dark:shadow-[inset_0_0_0_4px_rgba(15,23,42,1)]"
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
        transitionSpeed={1500}>
        <img
          alt="profile picture"
          className="tilt rounded-full "
          height="100%"
          src="/img/profile-fg.png"
          width="100%"
        />
      </Tilt>
    </div>
  )
}
