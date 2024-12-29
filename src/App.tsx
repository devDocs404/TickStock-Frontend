import { RouterProvider } from 'react-router-dom'

import { useState } from 'react'

import { createRoutes } from '@/Routes/Routes'
import useThemeProvider from '@/hooks/UseThemeProvider'

export function App() {
  const [isDark, setIsDark] = useState(false)
  const routes = createRoutes(isDark, setIsDark)
  useThemeProvider()

  return <RouterProvider router={routes} />
}
