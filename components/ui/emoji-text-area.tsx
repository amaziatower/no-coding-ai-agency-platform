// app/components/EmojiTextarea.tsx
'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false })

export interface EmojiTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onEmojiSelect?(emoji: any): void
}

const EmojiTextarea = React.forwardRef<HTMLTextAreaElement, EmojiTextareaProps>(
  ({ className, onEmojiSelect, onChange, value, ...props }, ref) => {
    const [showPicker, setShowPicker] = React.useState(false)
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    const handleEmojiSelect = (emoji: any) => {
      if (textareaRef.current) {
        const { selectionStart, selectionEnd } = textareaRef.current
        const currentValue = (value || '') as string
        const textBeforeCursor = currentValue.substring(0, selectionStart)
        const textAfterCursor = currentValue.substring(selectionEnd)
        const newValue = textBeforeCursor + emoji.emoji + textAfterCursor

        if (onChange) {
          const syntheticEvent = {
            target: {
              ...textareaRef.current,
              value: newValue,
            },
            currentTarget: textareaRef.current,
            bubbles: true,
            cancelable: false,
            defaultPrevented: false,
            eventPhase: 3,
            isTrusted: true,
            nativeEvent: new Event('input', { bubbles: true }),
            preventDefault: () => {},
            isDefaultPrevented: () => false,
            stopPropagation: () => {},
            isPropagationStopped: () => false,
            persist: () => {},
            timeStamp: Date.now(),
            type: 'input',
          } as React.ChangeEvent<HTMLTextAreaElement>

          onChange(syntheticEvent)
        }

        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          selectionStart + emoji.emoji.length
        textareaRef.current.focus()
      }
      setShowPicker(false)
      if (onEmojiSelect) {
        onEmojiSelect(emoji)
      }
    }

    return (
      <div className="relative">
        <textarea
          ref={(node) => {
            textareaRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ;(
                ref as React.MutableRefObject<HTMLTextAreaElement | null>
              ).current = node
            }
          }}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          value={value}
          onChange={onChange}
          {...props}
        />
        <button
          type="button"
          className="absolute bottom-2 right-2"
          onClick={() => setShowPicker(!showPicker)}
        >
          😊
        </button>
        {showPicker && (
          <div className="absolute bottom-10 right-0 z-10">
            <Picker onEmojiClick={handleEmojiSelect} />
          </div>
        )}
      </div>
    )
  },
)
EmojiTextarea.displayName = 'EmojiTextarea'

export { EmojiTextarea }
