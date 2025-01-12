import { DashboardHeader } from '@/components/header'
import { PostCreateButton } from '@/components/post-create-button'
import { PostItem } from '@/components/post-item'
import { DashboardShell } from '@/components/shell'
import { useTranslations } from 'next-intl'

export default function DashboardLoading() {
  const t = useTranslations('Loading')

  return (
    <DashboardShell>
      <DashboardHeader heading={t('heading')} text={t('text')}>
        <PostCreateButton />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
      </div>
    </DashboardShell>
  )
}
