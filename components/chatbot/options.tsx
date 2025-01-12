import {
  Bot,
  MessageSquare,
  Send,
  File,
  MessageCircle,
  BotMessageSquare,
  MessageCircleQuestion,
  MessageSquareHeart,
  MessageSquareMore,
  MessageSquareQuote,
  MessageCircleCode,
} from 'lucide-react'

export const colorOptions = [
  { value: 'red', label: 'Red', colorCode: '#FF0000' },
  { value: 'orange', label: 'Orange', colorCode: '#FFA500' },
  { value: 'yellow', label: 'Yellow', colorCode: '#FFFF00' },
  { value: 'green', label: 'Green', colorCode: '#008000' },
  { value: 'blue', label: 'Blue', colorCode: '#0000FF' },
  { value: 'indigo', label: 'Indigo', colorCode: '#4B0082' },
  { value: 'violet', label: 'Violet', colorCode: '#EE82EE' },
  {
    value: 'rainbow',
    label: 'Color Picker',
    colorCode:
      'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
  },
]

export const iconOptions = [
  { value: 'Bot', icon: <Bot />, label: 'Bot' },
  { value: 'BotIcon', icon: <MessageSquare />, label: 'Bot Icon' },
  {
    value: 'BotMessageSquare',
    icon: <BotMessageSquare />,
    label: 'Bot Message Square',
  },
  {
    value: 'MessageCircleQuestion',
    icon: <MessageCircleQuestion />,
    label: 'MessageCircleQuestion',
  },
  {
    value: 'MessageSquareHeart',
    icon: <MessageSquareHeart />,
    label: 'MessageSquareHeart',
  },
  {
    value: 'MessageSquareMore',
    icon: <MessageSquareMore />,
    label: 'MessageSquareMore',
  },
  {
    value: 'MessageSquareQuote',
    icon: <MessageSquareQuote />,
    label: 'MessageSquareQuote',
  },
  {
    value: 'MessageCircleCode',
    icon: <MessageCircleCode />,
    label: 'MessageCircleCode',
  },
]

export const iconMap: { [key: string]: JSX.Element } = {
  Bot: <Bot />,
  BotIcon: <MessageSquare />,
  BotMessageSquare: <BotMessageSquare />,
  MessageCircleQuestion: <MessageCircleQuestion />,
  MessageSquareHeart: <MessageSquareHeart />,
  MessageSquareMore: <MessageSquareMore />,
  MessageSquareQuote: <MessageSquareQuote />,
  MessageCircleCode: <MessageCircleCode />,
}

export const iconNames = [
  'Bot',
  'BotIcon',
  'BotMessageSquare',
  'MessageCircleQuestion',
  'MessageSquareHeart',
  'MessageSquareMore',
  'MessageSquareQuote',
  'MessageCircleCode',
]
