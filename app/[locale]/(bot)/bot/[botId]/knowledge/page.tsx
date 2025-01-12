import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { createServerSupabaseClient } from '@/supabase-server'
import KnowledgeClient from './_components/knowledge-client'

type Props = {
  params: { locale: string }
}

export default async function KnowledgePage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)
  const tKnowledgePage = await getTranslations('KnowledgePage')
  const tLinkCard = await getTranslations('LinkCard')
  const tDropzone = await getTranslations('Dropzone')

  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const translationsKnowledgePage = {
    title: tKnowledgePage('title'),
    description: tKnowledgePage('description'),
    documents: tKnowledgePage('documents'),
    csv: tKnowledgePage('csv'),
    links: tKnowledgePage('links'),
    uploadAndTrain: tKnowledgePage('uploadAndTrain'),
    loading: tKnowledgePage('loading'),
    buttonloading: tKnowledgePage('buttonloading'),
    successLinks: tKnowledgePage('successLinks'),
    successDocuments: tKnowledgePage('successDocuments'),
    errorProcessingLinks: tKnowledgePage('errorProcessingLinks'),
    errorProcessingFiles: tKnowledgePage('errorProcessingFiles'),
    tooltip: tKnowledgePage('tooltip'),
    resetKnowledgeBase: tKnowledgePage('resetKnowledgeBase'),
    typeToConfirm: tKnowledgePage('typeToConfirm'),
    errorOccured: tKnowledgePage('errorOccured'),
    successMessage: tKnowledgePage('successMessage'),
    footer: tKnowledgePage('footer'),
    reset: tKnowledgePage('reset'),
    scrapingLinks: tKnowledgePage('scrapingLinks'),
    scrapingError: tKnowledgePage('scrapingError'),
    resetKnowledgeBaseDescription: tKnowledgePage(
      'resetKnowledgeBaseDescription',
    ),
  }

  const translationsLinkCard = {
    title: tLinkCard('title'),
    description: tLinkCard('description'),
    fetchLinks: tLinkCard('fetchLinks'),
    includedLinks: tLinkCard('includedLinks'),
    deleteAll: tLinkCard('deleteAll'),
    addLink: tLinkCard('addLink'),
    placeholder: tLinkCard('placeholder'),
    noLinks: tLinkCard('noLinks'),
    gatherLinks: tLinkCard('gatherLinks'),
    scrapingLinks: tKnowledgePage('scrapingLinks'),
    scrapingError: tKnowledgePage('scrapingError'),
  }

  const translationsDropzone = {
    releaseToUpload: tDropzone('releaseToUpload'),
    dragFilesToUpload: tDropzone('dragFilesToUpload'),
    clickHere: tDropzone('clickHere'),
    supportedFiles: tDropzone('supportedFiles'),
    fileLimitError: tDropzone('fileLimitError'),
    dataLimitError: tDropzone('dataLimitError'),
    invalidFileType: tDropzone('invalidFileType'),
    allFiles: tDropzone('allFiles'),
  }

  return (
    <KnowledgeClient
      translations={translationsKnowledgePage}
      linkCardTranslations={translationsLinkCard}
      dropzoneTranslations={translationsDropzone}
      locale={locale}
    />
  )
}
