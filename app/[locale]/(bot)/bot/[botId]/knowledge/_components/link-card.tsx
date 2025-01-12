import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash } from 'lucide-react'
import { ReloadIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import toast from 'react-hot-toast'

export const LinkCard = ({
  links,
  onAdd,
  onChange,
  onRemove,
  onClear,
  translations,
}) => {
  const [loading, setLoading] = useState(false)

  const handleScrapeLinks = async () => {
    if (!links[0]) {
      console.error('No URL provided')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('/api/scrape_links', {
        url: [links[0]],
      })

      if (response.status === 200) {
        const { jobId } = response.data
        toast.success(translations.scrapingLinks)
        checkProgress(jobId)
      } else {
        const errorMessage = response.data?.message || response.statusText
        toast.error(translations.scrapingError)
        console.error('Error scraping links:', errorMessage)
      }
    } catch (error) {
      console.error('Error scraping links:', error)
      toast.error(translations.scrapingError)
    }
  }

  const checkProgress = async (jobId) => {
    const intervalId = setInterval(async () => {
      try {
        const statusResponse = await axios.get(`/api/scrape_links?jobId=${jobId}`)
        const { status, urls } = statusResponse.data

        if (status === 'completed') {
          clearInterval(intervalId)
          setLoading(false)
          
          if (!urls) {
            console.error('No URLs found in response')
            toast.error(translations.scrapingError)
            return
          }

          const newLinks = urls.map(item => item) // Directly map the urls array
          console.log('Links found:', newLinks)
          onClear()
          newLinks.forEach((newLink, index) => {
            if (index === 0) {
              onChange(newLink, 0) // Update the first input
            } else {
              onAdd(newLink) // Add new inputs for subsequent links
            }
          })
          toast.success(translations.successLinks)
        } else if (status === 'failed' || status === 'paused') {
          clearInterval(intervalId)
          setLoading(false)
          toast.error(translations.errorProcessingLinks)
          console.error(`Error processing links: Job ${status}`)
        }
      } catch (error) {
        console.error('Error checking job status:', error)
        clearInterval(intervalId)
        setLoading(false)
        toast.error(translations.errorProcessingLinks)
      }
    }, 2000)
  }

  return (
    <div className="flex w-full flex-col gap-4 rounded border border-muted-foreground p-4 shadow-sm">
      <h3 className="text-xl font-semibold">{translations.title}</h3>
      <p className="text-md font-semibold">{translations.description}</p>
      <p className="text-gray-500 text-sm">{translations.gatherLinks}</p>

      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full gap-2">
          <Input
            className="flex-1 border-muted-foreground"
            onChange={(e) => onChange(e.target.value, 0)}
            placeholder={translations.placeholder}
            type="text"
            value={links[0] || ''}
          />
          <Button
            onClick={handleScrapeLinks}
            variant="secondary"
            disabled={loading}
          >
            {loading ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                Scraping...
              </>
            ) : (
              translations.fetchLinks
            )}
          </Button>
        </div>
      </div>
      <div className="border-t border-muted-foreground my-4" />
      <div className="text-center mb-4">
        <h4 className="inline-block text-lg font-semibold">
          {translations.includedLinks}
        </h4>
        <Button
          onClick={onClear}
          variant="destructive"
          className="float-right ml-2"
        >
          {translations.deleteAll}
        </Button>
        <Button
          onClick={() => onAdd('')}
          variant="secondary"
          className="float-right"
        >
          {translations.addLink}
        </Button>
      </div>
      <div className="flex w-full flex-col gap-2">
        {links.map((link, index) => (
          <div key={index} className="flex w-full gap-2">
            <Input
              className="flex-1 border-muted-foreground"
              onChange={(e) => onChange(e.target.value, index)}
              placeholder={translations.placeholder}
              type="text"
              value={link}
            />
            <Button
              onClick={() => onRemove(index)}
              size="icon"
              variant="deleteGhost"
              className="text-red-500"
            >
              <Trash />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
