import { CardSkeleton } from '@/components/card-skeleton'
import { DashboardHeader } from '@/components/header'
import { DashboardShell } from '@/components/shell'
import { Card } from '@/components/ui/card'

export default function DashboardSettingsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Customization"
        text="Customize your chatbot settings."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}
