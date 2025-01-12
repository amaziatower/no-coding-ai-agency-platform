import { DashboardConfig } from '../types'

export const dashboardConfig: DashboardConfig = {
  locales: {
    en: {
      mainNav: [
        {
          title: 'Documentation',
          href: '/docs',
        },
        {
          title: 'Support',
          href: '/support',
          disabled: true,
        },
      ],
      sidebarNav: [
        {
          title: 'Dashboard',
          href: '/dashboard',
          icon: 'BotIcon',
        },
        {
          title: 'Account',
          href: '/dashboard/account',
          icon: 'CircleUser',
        },
        {
          title: 'Settings',
          href: '/dashboard/usage',
          icon: 'settings',
        },
      ],
      sidebarNavCreateBot: [
        {
          title: 'Dashboard',
          href: '/dashboard',
          icon: 'BotIcon',
        },
        {
          title: 'Customization',
          href: '/bot/customization',
          icon: 'MessageCircleIcon',
        },
        {
          title: 'Knowledge Base',
          href: '/bot/knowledge',
          icon: 'Upload',
        },
        {
          title: 'Integrations',
          href: '/bot/integrations',
          icon: 'Component',
        },
        {
          title: 'Analytics',
          href: '/bot/analytics',
          icon: 'BarChart',
        },
        {
          title: 'Embed',
          href: '/bot/embed',
          icon: 'Code',
        },
        {
          title: 'Delete Bot',
          href: '/bot/delete',
          icon: 'trash',
        },
      ],
    },
    fr: {
      mainNav: [
        {
          title: 'Documentation',
          href: '/docs',
        },
        {
          title: 'Support',
          href: '/support',
          disabled: true,
        },
      ],
      sidebarNav: [
        {
          title: 'Tableau de bord',
          href: '/dashboard',
          icon: 'BotIcon',
        },
        {
          title: 'Compte',
          href: '/dashboard/account',
          icon: 'CircleUser',
        },
        {
          title: 'Utilisation',
          href: '/dashboard/usage',
          icon: 'BarChart',
        },
      ],
      sidebarNavCreateBot: [
        {
          title: 'Tableau de bord',
          href: '/dashboard',
          icon: 'BotIcon',
        },
        {
          title: 'Personnalisé',
          href: '/bot/customization',
          icon: 'MessageCircleIcon',
        },
        {
          title: 'Base de connaissances',
          href: '/bot/knowledge',
          icon: 'Upload',
        },
        {
          title: 'Modules',
          href: '/bot/integrations',
          icon: 'Component',
        },
        {
          title: 'Rapports',
          href: '/bot/analytics',
          icon: 'BarChart',
        },
        {
          title: 'Intégrer',
          href: '/bot/embed',
          icon: 'Code',
        },
        {
          title: 'Delete Bot',
          href: '/bot/delete',
          icon: 'trash',
        },
      ],
    },
  },
}
