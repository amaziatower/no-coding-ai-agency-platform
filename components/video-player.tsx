'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

function VideoPlayer({ lang }: { lang: string }) {
  const [videoSrc, setVideoSrc] = useState('')

  useEffect(() => {
    const srcEn =
      'https://hpogngdwousevnyrnmew.supabase.co/storage/v1/object/public/demo/Ollabot-En-Introduction.mp4?t=2024-05-28T04%3A19%3A02.845Z'
    const srcFr =
      'https://hpogngdwousevnyrnmew.supabase.co/storage/v1/object/public/demo/Ollabot-Fr-Presentation.mp4?t=2024-05-28T04%3A19%3A22.690Z'

    setVideoSrc(lang === 'en' ? srcEn : srcFr)
  }, [lang])

  return (
    <div>
      {videoSrc && (
        <ReactPlayer
          controls
          height="auto"
          light={false}
          pip
          url={videoSrc}
          width="auto"
        />
      )}
    </div>
  )
}

export default VideoPlayer
