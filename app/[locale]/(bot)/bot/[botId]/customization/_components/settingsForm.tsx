'use client'
import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import { useRouter, usePathname } from 'next/navigation'
import { ReloadIcon } from '@radix-ui/react-icons'
import ChatbotPage from './chatbot'
import { EmojiTextarea } from '@/components/ui/emoji-text-area'
import { Switch } from '@/components/ui/switch'
import {
  ButtonGroup,
  ButtonGroupItem,
  ButtonGroupItemColor,
} from '@/components/ui/button-group'
import { iconOptions, colorOptions } from './options'
import { InfoTooltip } from '@/components/info-tooltip'
import { settingsSchema, SettingsFormData, Translations } from '@/types/chatbot' // Import schema and types
import Divider from '@mui/material/Divider'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const defaultbgColor = '#007BFF'
const defaultIcon = <MessageCircle />
const defaultBotName = 'Assistant'
const defaultCompanyName = 'Chatbot'
const defaultLogo = ''
const defaultDescription = ''
const defaultTone = 'Professional/Academic'
const defaultTemperature = 0.3

export default function SettingsForm({
  lang,
  userId,
  allowWatermarkRemove,
  translations,
  initialConfig,
}: {
  lang: string
  userId: string
  allowWatermarkRemove: boolean
  translations: Translations
  initialConfig: any
}) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...initialConfig,
      temperature: initialConfig.temperature ?? defaultTemperature, // Ensure default value
    },
  })
  const [isEditable, setIsEditable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [customColor, setCustomColor] = useState('#FFFFFF') // Default to white or any initial color
  const [bgColor, setbgColor] = useState(
    initialConfig.bgColor || defaultbgColor,
  )
  const [chatIcon, setChatIcon] = useState(
    initialConfig.chatBubbleIcon || defaultIcon,
  )
  const [botName, setBotName] = useState(
    initialConfig.botName || defaultBotName,
  )
  const [companyName, setCompanyName] = useState(
    initialConfig.companyName || defaultCompanyName,
  )
  const [companyLogo, setCompanyLogo] = useState(
    initialConfig.logoUrl || defaultLogo,
  )
  const [temperature, setTemperature] = useState(
    initialConfig.temperature || defaultTemperature,
  )
  const [tone, setTone] = useState(initialConfig.tone || defaultTone)
  const [avatarImg, setAvatarImg] = useState(initialConfig.avatarUrl || '') // This will store the user avatar image data URL or base64 string
  const [description, setDescription] = useState(
    initialConfig.description || defaultDescription,
  )
  const [welcomeMessage, setWelcomeMessage] = useState(
    initialConfig.welcomeMessage || '',
  )
  const [includeWatermark, setIncludeWatermark] = useState(
    initialConfig.includeWatermark !== undefined
      ? initialConfig.includeWatermark
      : true,
  )
  const [resetConfirmText, setResetConfirmText] = useState('')

  const router = useRouter()

  const toggleEdit = () => {
    setIsEditable(!isEditable)
    reset(initialConfig)
  }

  const botNameWatch = watch('botName')
  const companyNameWatch = watch('companyName')

  const isSubmitDisabled = !botNameWatch || !companyNameWatch

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(event.target.value)
  }

  const handleWelcomeMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setWelcomeMessage(event.target.value)
  }

  const pathname = usePathname()

  // Extracting botId from the pathname
  const pathSegments = pathname.split('/')
  const botIndex = pathSegments.indexOf('bot')
  const botId = botIndex !== -1 ? pathSegments[botIndex + 1] : null

  const onSubmit = async (data: SettingsFormData) => {
    try {
      setLoading(true) // Start loading
      toast.success(translations.settingsUpdating)

      const formData = new FormData()
      console.log('Preparing form data')

      // Helper function to conditionally append fields
      const appendToFormData = (key: string, value: any) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value)
        }
      }

      appendToFormData('botName', data.botName)
      appendToFormData('companyName', data.companyName)
      appendToFormData('description', data.description)
      appendToFormData('chatBubbleIcon', data.chatBubbleIcon)
      appendToFormData('bgColor', data.bgColor)
      appendToFormData('welcomeMessage', data.welcomeMessage)
      appendToFormData('tone', data.tone || defaultTone)
      appendToFormData('temperature', data.temperature?.toString())
      appendToFormData('includeWatermark', includeWatermark?.toString())

      if (data.companyLogo && data.companyLogo[0]) {
        console.log('Adding company logo to form data')
        formData.append('companyLogo', data.companyLogo[0])
      }
      if (data.avatarImg && data.avatarImg[0]) {
        console.log('Adding avatar image to form data')
        formData.append('avatarImg', data.avatarImg[0])
      }

      console.log('Sending API request to update settings')
      // Call the consolidated API route
      const response = await fetch(`/api/chatbot/${botId}/updateSettings`, {
        method: 'PATCH',
        body: formData,
      })

      const responseData = await response.json()
      if (!response.ok) {
        console.log('Error updating settings:', responseData.message)
        throw new Error(responseData.message || 'Failed to update settings')
      }

      console.log('Settings updated successfully')
      toast.success(translations.settingsUpdatedSuccessfully)
      setIsEditable(false)
    } catch (error) {
      console.error('Error during settings update:', error)
      toast.error(
        `${translations.errorUpdatingSettings}: ${translations.errorFetchingData}`,
      )
    } finally {
      console.log('Finishing settings update')
      setLoading(false) // End loading
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        if (e.target) {
          const imageDataUrl = e.target.result.toString()
          setAvatarImg(imageDataUrl) // Store the image data URL in the state
          setValue('avatarImg', event.target.files) // Update the form state with the file
        }
      }
      fileReader.readAsDataURL(file)
    }
  }

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        if (e.target) {
          const imageDataUrl = e.target.result.toString()
          setCompanyLogo(e.target.result.toString()) // Store the image data URL in the state
          setValue('companyLogo', event.target.files) // Update the form state with the file
        }
      }
      fileReader.readAsDataURL(file)
    }
  }

  const handleIconChange = (iconType) => {
    setChatIcon(iconType || defaultIcon) // Update icon or use default
  }

  const handleRainbowSelect = () => {
    setShowColorPicker(true)
  }

  const handleReset = async () => {
    if (resetConfirmText.toLowerCase() === 'reset') {
      try {
        setLoading(true)
        const response = await fetch(`/api/chatbot/${botId}/resetConfig`, {
          method: 'DELETE',
        })

        const responseData = await response.json()
        if (!response.ok) {
          console.log(
            'Error resetting bot configuration:',
            responseData.message,
          )
          throw new Error(
            responseData.message || 'Failed to reset bot configuration',
          )
        }

        console.log('Bot configuration reset successfully')
        toast.success(translations.settingsResetSuccessfully)
        router.refresh()
      } catch (error) {
        console.error('Error during settings reset:', error)
        toast.error(`${translations.errorResettingSettings}: ${error.message}`)
      } finally {
        setLoading(false)
        setResetConfirmText('')
        router.refresh()
      }
    } else {
      toast.error(translations.errorResetConfirmation)
    }
  }

  return (
    <div className="flex grid-rows-2 gap-4">
      <div className="grid-rows-8 gap-5 p-8 w-full rounded border border-muted-foreground">
        <Button
          className="mb-4"
          variant="secondary"
          type="button"
          onClick={toggleEdit}
        >
          {isEditable ? translations.cancel : translations.editChatbotSettings}
        </Button>
        <Divider variant="fullWidth" className="my-2" />

        <div className="flex flex-row items-center gap-2 my-6">
          <h1 className="text-2xl font-bold">{translations.heading}</h1>
          <InfoTooltip markdownText={translations.tooltip} />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5 flex space-x-4">
            <div className="flex-1">
              <Label className="font-bold" htmlFor="bot-name">
                {translations.botNameLabel}
              </Label>
              <Input
                id="bot-name"
                {...register('botName')}
                onChange={(e) => setBotName(e.target.value)}
                placeholder={translations.botNamePlaceholder}
                disabled={!isEditable}
              />

              {errors.botName && <p>{errors.botName.message}</p>}
            </div>

            <div className="flex-1">
              <Label className="font-bold" htmlFor="company-name">
                {translations.companyNameLabel}
              </Label>
              <Input
                id="company-name"
                {...register('companyName')}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={translations.companyNamePlaceholder}
                disabled={!isEditable}
              />
              {errors.companyName && <p>{errors.companyName.message}</p>}
            </div>
          </div>

          <Label className="font-bold" htmlFor="description">
            {translations.descriptionLabel}
          </Label>
          <EmojiTextarea
            id="description"
            value={description}
            {...register('description')}
            onChange={handleDescriptionChange}
            placeholder={translations.descriptionPlaceholder}
            disabled={!isEditable}
          />
          <div className="mb-5 flex space-x-4">
            <div className="flex-1">
              <Controller
                control={control}
                name="tone"
                render={({ field }) => (
                  <div>
                    <Label className="font-bold">
                      {translations.toneLabel}
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {' '}
                      {translations.optional}{' '}
                    </span>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setTone(value)
                      }}
                      disabled={!isEditable}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={translations.tonePlaceholder}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professional/Academic">
                          Professional/Academic
                        </SelectItem>
                        <SelectItem value="Casual/Friendly">
                          Casual/Friendly
                        </SelectItem>
                        <SelectItem value="Instructive/Authoritative">
                          Instructive/Authoritative
                        </SelectItem>
                        <SelectItem value="Conversational/Engaging">
                          Conversational/Engaging
                        </SelectItem>
                        <SelectItem value="Inspirational/Motivational">
                          Inspirational/Motivational
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.tone && <p>{errors.tone.message}</p>}
                  </div>
                )}
              />
            </div>
            <div className="flex-1">
              <div className="mb-5 flex space-x-4">
                <div className="flex-1">
                  <Label className="font-bold" htmlFor="temperature">
                    {translations.temperatureLabel}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {' '}
                    {translations.optional}{' '}
                  </span>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    {...register('temperature', {
                      valueAsNumber: true,
                      onChange: (e) => {
                        setTemperature(e.target.value)
                      },
                    })}
                    placeholder={translations.temperaturePlaceholder}
                    disabled={!isEditable}
                  />
                  {errors.temperature && <p>{errors.temperature.message}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <Label className="font-bold" htmlFor="company-logo">
                {translations.companyLogoLabel}
              </Label>
              <span className="text-xs text-muted-foreground">
                {' '}
                {translations.optional}{' '}
              </span>
              <Input
                id="company-logo"
                type="file"
                onChange={handleLogoChange}
                {...register('companyLogo')}
                disabled={!isEditable}
              />
              {errors.companyLogo && <p>Company logo is required</p>}
            </div>
            <div className="flex-1">
              <Label className="font-bold" htmlFor="bot-avatar">
                {translations.botAvatarLabel}{' '}
              </Label>
                <span className="text-xs text-muted-foreground">
                  {' '}
                  {translations.optional}{' '}
                </span>
              <Input
                id="bot-avatar"
                type="file"
                onChange={handleAvatarChange}
                {...register('avatarImg')}
                disabled={!isEditable}
              />
              {errors.avatarImg && <p>Avatar Image logo is required</p>}
            </div>
          </div>

          <div className="flex grid-cols-2" />
          <Controller
            control={control}
            name="chatBubbleIcon"
            render={({ field }) => (
              <div>
                <Label className="font-bold">
                  {translations.chatBubbleIconLabel}
                </Label>
                <span className="text-xs text-muted-foreground">
                  {' '}
                  {translations.optional}{' '}
                </span>
                <ButtonGroup {...field} ref={field.ref} disabled={!isEditable}>
                  <div className="mb-5 mt-2 flex items-center space-x-2">
                    {iconOptions.map((option) => (
                      <ButtonGroupItem
                        key={option.value}
                        icon={option.icon}
                        label={option.label}
                        onClick={() => {
                          field.onChange(option.value)
                          handleIconChange(option.value)
                        }}
                        value={option.value}
                      />
                    ))}
                  </div>
                </ButtonGroup>
              </div>
            )}
          />
          {errors.chatBubbleIcon && <p>{errors.chatBubbleIcon.message}</p>}

          <Controller
            control={control}
            name="bgColor"
            render={({ field: { onChange, value } }) => (
              <div>
                <Label>{translations.bgColorLabel}</Label>
                <span className="text-xs text-muted-foreground"> {translations.optional} </span>
                <ButtonGroup disabled={!isEditable}>
                  <div className="mb-5 mt-2 flex items-center space-x-2">
                    {colorOptions.map((color) => (
                      <ButtonGroupItemColor
                        key={color.value}
                        colorCode={color.colorCode}
                        label={color.label}
                        onClick={() => {
                          if (color.value === 'rainbow') {
                            handleRainbowSelect()
                          } else {
                            onChange(color.colorCode)
                            setbgColor(color.colorCode)
                          }
                        }}
                        value={color.value}
                        checked={value === color.value}
                      />
                    ))}
                  </div>
                </ButtonGroup>
                {showColorPicker && (
                  <div className="mt-2">
                    <input
                      onChange={(e) => {
                        const color = e.target.value
                        onChange(color)
                        setbgColor(color)
                      }}
                      type="color"
                      value={bgColor}
                      disabled={!isEditable}
                    />
                    <button
                      className="ml-2 rounded border p-1"
                      onClick={() => setShowColorPicker(false)}
                      type="button"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            )}
          />
          {errors.bgColor && <p>{errors.bgColor.message}</p>}

          <span className="text-sm text-gray-500 ml-2 mb-3">Color chosen: {bgColor}</span>

          <div className="mx-auto flex grid-cols-2 gap-4">
            <div className="flex-1">
              <Label className="font-bold" htmlFor="welcome-message">
                {translations.welcomeMessageLabel}{' '}
              </Label>
              <span className="text-xs text-muted-foreground">
                {' '}
                {translations.optional}{' '}
              </span>
              <EmojiTextarea
                id="welcome-message"
                value={welcomeMessage}
                {...register('welcomeMessage')}
                onChange={handleWelcomeMessageChange}
                placeholder={translations.descriptionPlaceholder}
                disabled={!isEditable}
              />
            </div>
          </div>

          <div className="my-5 flex items-center space-x-2">
            <Label
              className="flex flex-col font-bold"
              htmlFor="includeWatermark"
            >
              {translations.includeWatermarkLabel}
              {!allowWatermarkRemove && (
                <span className="text-xs text-muted-foreground">
                  {' '}
                  {translations.forUnlimitedUsersOnly}{' '}
                </span>
              )}
            </Label>
            <Controller
              control={control}
              name="includeWatermark"
              render={({ field }) => (
                <Switch
                  checked={includeWatermark}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                    setIncludeWatermark(checked)
                  }}
                  disabled={!allowWatermarkRemove || !isEditable} // Disable the switch if allowWatermarkRemove is false
                />
              )}
            />
          </div>

          {isEditable && (
            <>
              {loading ? (
                <Button
                  className="mr-4"
                  type="submit"
                  variant="secondary"
                  disabled={isSubmitDisabled}
                >
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  {translations.savingChanges}
                </Button>
              ) : (
                <Button
                  className="mr-4"
                  type="submit"
                  variant="secondary"
                  disabled={!isEditable || isSubmitDisabled}
                >
                  {translations.saveChanges}
                </Button>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="destructive" type="button">
                    {translations.reset}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4 p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">
                        {translations.resetConfirmationTitle}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {translations.resetConfirmationDescription}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="resetConfirmation">
                          {translations.typeToConfirm}
                        </Label>
                        <Input
                          id="resetConfirmation"
                          value={resetConfirmText}
                          onChange={(e) => setResetConfirmText(e.target.value)}
                          className="col-span-2 h-8"
                        />
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleReset}
                      disabled={loading}
                    >
                      {loading
                        ? translations.resetting
                        : translations.confirmReset}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
        </form>
      </div>
      <ChatbotPage
        bgColor={bgColor}
        avatarImg={avatarImg}
        botName={botName}
        companyLogo={companyLogo}
        companyName={companyName}
        description={description}
        tone={tone}
        temperature={temperature}
        lang={lang}
        botId={botId}
        chatBubbleIcon={chatIcon.toString() || defaultIcon.toString()}
        watermark={includeWatermark}
        welcomeMessage={welcomeMessage}
      />
    </div>
  )
}
