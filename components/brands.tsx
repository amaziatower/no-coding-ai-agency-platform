import { useTranslations } from 'next-intl'
import React from 'react'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaRedditAlien,
  FaShopify,
  FaTiktok,
  FaWordpressSimple,
  FaYoutube,
} from 'react-icons/fa'
import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(() => import('./video-player'), { ssr: false })

export function Brands() {
  const t = useTranslations('IndexPage')

  return (
    <section className="flex flex-col py-6 text-center text-white">
      <div className="flex w-full bg-statsColor py-6 text-center text-white">
        <div className="lg:w-9/10 container mx-auto px-6 sm:w-full">
          <div className="mb-8 mt-2 items-center text-center text-4xl font-bold">
            &quot;{t('platforms')}&quot;
          </div>
          <div className="flex flex-col items-center justify-between sm:flex-row sm:justify-around">
            <div className="my-2 flex w-full items-center justify-around">
              <FaWordpressSimple className="size-12 text-white" />
              <FaFacebookF className="size-12 text-white" />
              <FaRedditAlien className="size-12 text-white" />
              <FaInstagram className="size-12 text-white" />
            </div>
            <div className="my-2 flex w-full items-center justify-around">
              <FaYoutube className="size-12 text-white" />
              <FaTiktok className="size-12 text-white" />
              <FaShopify className="size-12 text-white" />
              <FaLinkedin className="size-12 text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="container mb-14 mt-8 flex max-w-7xl flex-col items-center gap-6 text-center">
        <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-3xl">
          Demo
        </h1>
        <VideoPlayer lang={t('lang')} />
      </div>
    </section>
  )
}

export default Brands
