import { DocsConfig } from 'types'

export const apiConfig: DocsConfig = {
  mainNav: [
    {
      title: 'Documentation',
      href: '/docs',
    },    
    {
      title: 'API',
      href: '/api',
    },
  ],
  sidebarNav: [
    {
      title: 'Getting Started',
      items: [
        {
          title: 'Introduction',
          href: '/docs',
        },        
      ],
    },
    {
      title: 'Guides',
      items: [
        {
          title: 'Create a Chatbot',
          href: '/api/create-chatbot',
        },        
        {
          title: 'Delete a Chatbot',
          href: '/api/delete-chatbot',
        },
        {
          title: 'Chat',
          href: '/api/chat',
        },
        {
          title: 'Updating Chatbot Settings',
          href: '/api/update-settings',
        },
      ],
    },
  ],
}
