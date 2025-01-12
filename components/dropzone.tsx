'use client'

import React, { useRef, useState } from 'react'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface DropzoneProps {
  onChange: React.Dispatch<React.SetStateAction<Array<File>>>
  className?: string
  fileExtensions?: Array<string> // Array of allowed file extensions
  numLimit?: number // Maximum number of files
  dataLimit?: number // Maximum data size in MB
  translations: any
  locale: string
}

export const Dropzone: React.FC<DropzoneProps> = ({
  className,
  dataLimit = 5,
  fileExtensions,
  numLimit = 3,
  onChange,
  translations,
  locale
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fileInfo, setFileInfo] = useState<Array<string>>([])
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    if (files.length > numLimit) {
      setError(translations.fileLimitError)
      return
    }

    const totalSizeMB = Array.from(files).reduce(
      (acc, file) => acc + file.size / 1024 / 1024,
      0,
    )
    if (totalSizeMB > dataLimit) {
      setError(translations.dataLimitError)
      return
    }

    if (
      fileExtensions &&
      !Array.from(files).every((file) =>
        fileExtensions.some((ext) => file.name.endsWith(`.${ext}`)),
      )
    ) {
      setError(translations.invalidFileType)
      return
    }

    setError(null)
    onChange(Array.from(files))

    // Update file info display for each file
    const fileDetails = Array.from(files).map(
      (file) => `${file.name} (${Math.round(file.size / 1024)} KB)`,
    )
    setFileInfo(fileDetails)
  }

  const handleCardClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card
      className={`border-2 ${isDragOver ? 'border-green border-dashed' : 'text-primary'} border-dashed border-gray-500 bg-accent hover:cursor-pointer hover:border-muted ${className}`}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}


      onDrop={handleDrop}
      onClick={handleCardClick} // Added onClick handler to the Card
    >
      <CardContent className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs">
        <Icons.fileplus className="size-9 text-secondary" />
        <div className="flex items-center justify-center font-bold">
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {isDragOver ? translations.releaseToUpload : translations.dragFilesToUpload} 
            {!isDragOver && (
              <Button
                className="ml-auto flex h-8 space-x-2 px-0 pl-1 text-xs font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
                size="sm"
                variant="ghost"
              >
                {translations.clickHere}
              </Button>
            )}
          </span>
          <input
            ref={fileInputRef}
            accept={
              fileExtensions
                ? fileExtensions.map((ext) => `.${ext}`).join(',')
                : '*'
            }
            className="hidden"
            multiple
            onChange={handleFileInputChange}
            type="file"
          />
        </div>
        <p className="text-gray-500">
          {locale === 'fr'
            ? `Nous supportons uniquement les fichiers ${fileExtensions ? fileExtensions.join(', ') : ''} jusqu'à ${dataLimit} Mo. Faites glisser et déposez votre fichier en une seule fois.`
            : `We support only ${fileExtensions ? fileExtensions.join(', ') : ''} files up to ${dataLimit} MB in size. Drag and drop your file in one go.`}
        </p>
        {fileInfo.map((info, index) => (
          <p key={index}>{info}</p>
        ))}
        {error && <span className="text-red-500">{error}</span>}
      </CardContent>
    </Card>
  )
}