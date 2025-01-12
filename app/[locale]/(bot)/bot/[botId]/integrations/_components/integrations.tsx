// app/integrations/integrations-client.tsx
'use client'
import { SearchIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const IntegrationCard = ({ integration, viewButton }) => (
  <div className="flex flex-col items-center space-y-4 rounded-lg border border-muted-foreground p-4 text-primary shadow-sm">
    <div className="h-[50px] w-auto items-center flex">
      <Image
        alt={`${integration.name} Logo`}
        height={100}
        sizes="(max-width: 100px) 100vw, (max-width: 10px) 50vw, 33vw"
        src={integration.logo}
        width={100}
      />
    </div>

    <h2 className="font-bold">{integration.name}</h2>
    <p className="text-sm text-gray-500">{integration.description}</p>
    <Link href={integration.link} passHref>
      <Button className="" size="md" variant="secondary">
        {viewButton}
      </Button>
    </Link>
  </div>
)

export default function IntegrationsPageClient({ translations }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredIntegrations = translations.integrations.filter((integration) =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8 text-primary">
      <div className="mb-6">
        <div className="flex items-center overflow-hidden rounded border border-muted-foreground px-5">
          <Input
            className="w-full border-muted-foreground px-6 py-2"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={translations.searchPlaceholder}
            type="search"
          />
          <div className="p-4">
            <SearchIcon className="size-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredIntegrations.map((integration) => (
          <IntegrationCard
            key={integration.name}
            integration={integration}
            viewButton={translations.viewButton}
          />
        ))}
      </div>
    </div>
  )
}
