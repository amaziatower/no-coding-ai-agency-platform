import Image from 'next/image'
import phonesrc1 from '/public/images/phone.png'
import phonesrc2 from '/public/images/phone2.png'
import phonesrc3 from '/public/images/phone3.png'
import { useTranslations } from 'next-intl'
import { FaGlobe, FaYoutube, FaInstagram, FaFileUpload } from 'react-icons/fa'
import { FaLink } from 'react-icons/fa6'
import { ImEmbed } from 'react-icons/im'
import { MdOutlineWebhook, MdLaptopWindows } from 'react-icons/md'

export function HowItWorks() {
  const t = useTranslations('HowItWorks')

  const features = [
    {
      id: 1,
      title: t('title'),
      description: t('description'),
      subtitle: t('subtitle'),
      subdescription: t('subdescription'),
      imageSrc: phonesrc1,
      imageAlt: 'Feature 1',
    },
    {
      id: 2,
      title: t('title2'),
      description: '',
      subtitle: '',
      subdescription: t('subdescription2'),
      imageSrc: phonesrc1,
      imageAlt: 'Feature 2',
    },
    {
      id: 3,
      title: t('title3'),
      description: t('description3'),
      subtitle: t('subtitle3'),
      subdescription: t('subdescription3'),
      imageSrc: phonesrc3,
      imageAlt: 'Feature 3',
    },
  ]

  return (
    <section className="pricingBackground mx-auto flex flex-row justify-between text-justify md:flex-row">
      <div className="mx-auto flex size-full flex-col justify-around gap-7 p-8 text-center sm:w-full md:flex-row">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className="container mx-auto flex size-full flex-col justify-between gap-7 p-3 text-center sm:w-full sm:p-1 md:flex-col"
          >
            <h1 className="items-center justify-start text-center text-3xl font-bold text-violetColor ">
              0{feature.id}
            </h1>
            <div className="space-y-2 text-center sm:w-full">
              <h2 className="xs:text-lg items-center text-center text-xl font-bold">
                {feature.title}
              </h2>
              <p className="text-sm font-bold text-grayColor">
                {feature.description}
              </p>
            </div>
            <div className="flex w-full">
              {feature.id === 1 ? (
                <div className="flex size-full flex-col items-center justify-around gap-4 sm:w-full">
                  <div className="flex w-4/5 flex-row justify-around sm:w-full">
                    <div className="flex w-full flex-col items-center justify-start">
                      <FaGlobe className="text-4xl" />
                      <h2 className="mt-3 text-center text-sm font-bold">
                        Website
                      </h2>
                      <p className="text-center text-sm font-bold text-grayColor">
                        Choose this option
                      </p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-end">
                      <FaInstagram className="text-4xl" />
                      <h2 className="mt-3 text-center text-sm font-bold">
                        Instagram
                      </h2>
                      <p className="text-center text-sm font-bold text-grayColor">
                        Choose this option
                      </p>
                    </div>
                  </div>
                  <div className="flex w-4/5 flex-row justify-between sm:w-full">
                    <div className="flex w-full flex-row items-center justify-between">
                      <div className="flex w-full flex-col items-center justify-start">
                        <FaYoutube className="text-4xl" />
                        <h2 className="mt-3 text-center text-sm font-bold">
                          YouTube
                        </h2>
                        <p className="text-center text-sm font-bold text-grayColor">
                          Choose this option
                        </p>
                      </div>
                      <div className="flex w-full flex-col items-center justify-end">
                        <FaFileUpload className="text-4xl" />
                        <h2 className="mt-3 text-center text-sm font-bold">
                          File
                        </h2>
                        <p className="text-center text-sm font-bold text-grayColor">
                          Choose this option
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : feature.id === 3 ? (
                // Render div for id 3
                <div className="flex size-full flex-col items-center justify-between gap-4 sm:w-full">
                  <div className="flex w-full flex-row justify-between sm:w-full">
                    <div className="flex w-full flex-col items-center justify-start">
                      <MdLaptopWindows className="text-4xl" />
                      <h2 className="mt-3 text-center text-sm font-bold">
                        Website
                      </h2>
                    </div>
                    <div className="flex w-full flex-col items-center justify-end">
                      <FaInstagram className="text-4xl" />
                      <h2 className="mt-3 text-center text-sm font-bold">
                        Instagram
                      </h2>
                    </div>
                    <div className="flex w-full flex-col items-center justify-end">
                      <FaLink className="text-4xl" />
                      <h2 className="mt-3 text-center text-sm font-bold">
                        URL
                      </h2>
                    </div>
                  </div>
                  <div className="mt-2 flex w-4/5 flex-row justify-between sm:w-full">
                    <div className="flex w-full flex-row items-center justify-between">
                      <div className="flex w-full flex-col items-center justify-start">
                        <MdOutlineWebhook className="text-4xl" />
                        <h2 className="mt-3 text-center text-sm font-bold">
                          Webhook
                        </h2>
                      </div>
                      <div className="flex w-full flex-col items-center justify-end">
                        <ImEmbed className="text-4xl" />
                        <h2 className="mt-3 text-center text-sm font-bold">
                          Embed
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              ) : feature.id === 2 ? (
                // Render image for even ids
                <Image
                  alt={feature.imageAlt}
                  className="size-full sm:w-full"
                  src={feature.imageSrc}
                  width={318}
                />
              ) : (
                <div>Custom content for odd feature id</div>
              )}
            </div>
            <div className="w-full justify-end text-center ">
              <div className="grow" />{' '}
              {/* This div will push the subtitle to the bottom */}
              {feature.subtitle && (
                <h2 className="text-2xl font-bold">{feature.subtitle}</h2>
              )}
              {feature.subdescription && (
                <p className="text-sm font-bold text-grayColor">
                  {feature.subdescription}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
