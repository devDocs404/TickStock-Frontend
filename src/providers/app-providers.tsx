import { QueryClientProvider } from '@tanstack/react-query'

import { ReactNode } from 'react'

import { ThemeProvider } from '@/components/theme-provider'
import { queryClient } from '@/lib/query-client'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}
