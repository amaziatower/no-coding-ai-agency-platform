'use client'
import { ReloadIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Dropzone } from '@/components/dropzone'
import { Button } from '@/components/ui/button'
import { LinkCard } from './link-card'
import { InfoTooltip } from '@/components/info-tooltip' // Import your InfoTooltip component
import ResetKnowledgeBaseForm from './reset-knowledge-base'
import { Progress } from '@/components/ui/progress' // Import ShadCN UI Progress component

const API_KEY = process.env.SERVER_API_KEY

type Translations = {
  title: string
  description: string
  documents: string
  csv: string
  links: string
  uploadAndTrain: string
  loading: string
  buttonloading: string
  successLinks: string
  successDocuments: string
  scrapingLinks: string
  scrapingError: string
  errorProcessingLinks: string
  errorProcessingFiles: string
  tooltip: string
  resetKnowledgeBase: string
  typeToConfirm: string
  errorOccured: string
  successMessage: string
  footer: string
  reset: string
  resetKnowledgeBaseDescription: string
}

export default function KnowledgeClient({
  translations,
  linkCardTranslations,
  dropzoneTranslations,
  locale,
}: {
  translations: Translations
  linkCardTranslations: any
  dropzoneTranslations: any
  locale: string
}) {
  const { handleSubmit } = useForm()
  const [files, setFiles] = useState([])
  const [selectedOption, setSelectedOption] = useState('Documents')
  const [loading, setLoading] = useState(false)
  const [links, setLinks] = useState([''])
  const [progress, setProgress] = useState(0) // State for progress
  const [taskRunning, setTaskRunning] = useState(false) // State for task running

  const pathname = usePathname()
  const router = useRouter()

  // Extracting botId from the pathname
  const pathSegments = pathname.split('/')
  const botIndex = pathSegments.indexOf('bot')
  const botId = botIndex !== -1 ? pathSegments[botIndex + 1] : null

  const handleLinkChange = (value, index) => {
    const newLinks = [...links]
    newLinks[index] = value
    setLinks(newLinks)
  }

  const addNewLink = (newLink = '') => {
    setLinks((prevLinks) => [...prevLinks, newLink])
  }

  const removeLink = (index) => {
    const newLinks = [...links]
    newLinks.splice(index, 1)
    setLinks(newLinks)
  }

  const handleClearLinks = () => {
    setLinks([''])
  }

  const handleSubmission = async () => {
    setLoading(true)
    setTaskRunning(true)
    setProgress(0) 

    if (selectedOption === 'Links') {
      const validLinks = links.filter((link) => link.trim() !== '')
      if (validLinks.length > 0) {
        try {
          const response = await axios.post(
            `/api/chatbot/${botId}/upsert_links`,
            {
              urls: validLinks,
              use_metadata: true,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          console.log('Processing response:', response.data)

          const { task_id } = response.data
          checkProgress(task_id)

        } catch (error) {
          console.error(
            'Error processing links:',
            error.response?.data || error.message,
          )
          toast.error(translations.errorProcessingLinks)
          setTaskRunning(false)
        }
      }
    } else {
      console.log('Files to process:', files)
      if (files.length > 0) {
        const formData = new FormData()
        files.forEach((file) => formData.append('files', file))

        console.log('Form data', formData)
        try {
          const response = await axios.post(
            `/api/chatbot/${botId}/upsert_files`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          )

          const { task_id } = response.data
          checkProgress(task_id)

        } catch (error) {
          console.error(
            'Error processing files:',
            error.response?.data || error.message,
          )
          toast.error(translations.errorProcessingFiles)
          setTaskRunning(false)
        }
      }
    }
  }

  const checkProgress = async (task_id) => {
    try {
      const statusResponse = await axios.get(`/api/chatbot/task_status?task_id=${task_id}`)
      const { status, progress, result } = statusResponse.data
      if (status === 'COMPLETED') {
        setProgress(100)
        toast.success(translations.successDocuments)
        setLoading(false)
        setTaskRunning(false)
      } else if (status === 'FAILED') {
        console.log("STATUS Failed: ", result.detail);
        toast.error(translations.errorProcessingFiles)
        setLoading(false)
        setTaskRunning(false)
      } else {
        console.log("progress", progress);
        setProgress(progress)
        setTimeout(() => checkProgress(task_id), 1000)
      }
    } catch (error) {
      console.error('Error fetching task status:', error)
      toast.error(translations.errorProcessingFiles)
      setLoading(false)
      setTaskRunning(false)
    }
  }

  return (
    <div className="container flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">{translations.title}</h1>
        <InfoTooltip markdownText={translations.tooltip} />
      </div>
      <p className="text-sm text-gray-500">{translations.description}</p>
      <div className="border-1 flex w-full items-center justify-center gap-3 p-3">
        <Button
          className={`text-xs font-bold ${selectedOption === 'Documents' ? 'text-ollabot' : 'text-gray-500'}`}
          onClick={() => setSelectedOption('Documents')}
          size="xxs"
          variant="ghost"
        >
          {translations.documents}
        </Button>
        <Button
          className={`text-xs font-bold ${selectedOption === 'CSV' ? 'text-ollabot' : 'text-gray-500'}`}
          onClick={() => setSelectedOption('CSV')}
          size="xxs"
          variant="ghost"
        >
          {translations.csv}
        </Button>
        <Button
          className={`text-xs font-bold ${selectedOption === 'Links' ? 'text-ollabot' : 'text-gray-500'}`}
          onClick={() => setSelectedOption('Links')}
          size="xxs"
          variant="ghost"
        >
          {translations.links}
        </Button>
        <Button
          className={`text-xs font-bold ${selectedOption === 'Reset' ? 'text-ollabot' : 'text-gray-500'}`}
          onClick={() => setSelectedOption('Reset')}
          size="xxs"
          variant="ghost"
        >
          {translations.reset}
        </Button>
      </div>

      {selectedOption === 'Documents' || selectedOption === 'CSV' ? (
        <>
          <Dropzone
            className="dropzone"
            dataLimit={15}
            fileExtensions={['pdf', 'txt', 'md', 'csv']}
            numLimit={1}
            onChange={(files) => setFiles(files)}
            translations={dropzoneTranslations}
            locale={locale}
          />
          <div className="flex flex-col items-center justify-center p-5">
            {taskRunning && (
              <div className="mb-3">
                <Progress value={progress} className="w-full mb-1" />
                <p className="text-gray-500 text-sm m-1">{translations.loading}</p>
              </div>
            )}
            {loading ? (
              <Button
                className=""
                disabled={files.length === 0}
                size="lg"
                variant="secondary"
                onClick={handleSubmission}
              >
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                {translations.buttonloading}
              </Button>

            ) : (
              <Button
                className=""
                disabled={files.length === 0}
                size="lg"
                variant="secondary"
                onClick={handleSubmission}
              >
                {translations.uploadAndTrain}
              </Button>
            )}
          </div>
        </>
      ) : selectedOption === 'Links' ? (
        <div>
          <LinkCard
            links={links}
            onAdd={addNewLink}
            onChange={handleLinkChange}
            onRemove={removeLink}
            onClear={handleClearLinks}
            translations={linkCardTranslations}
          />
          <div className="flex flex-col items-center justify-center p-5">
            {taskRunning && (
              <div className="mb-3">
                <Progress value={progress} className="w-full mb-1" />
                <p className="text-gray-500 text-sm m-1">{translations.loading}</p>
              </div>
            )}            
            {loading ? (
              <Button
                disabled={!links.some((link) => link.trim() !== '')}
                onClick={handleSubmission}
                size="lg"
                variant="secondary"
              >
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                {translations.buttonloading}
              </Button>
            ) : (
              <Button
                disabled={!links.some((link) => link.trim() !== '')}
                onClick={handleSubmission}
                size="lg"
                variant="secondary"
              >
                {translations.uploadAndTrain}
              </Button>
            )}
          </div>
        </div>
      ) : selectedOption === 'Reset' ? (
        <ResetKnowledgeBaseForm translations={translations} />
      ) : null}
    </div>
  )
}
