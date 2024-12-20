import { RouterProvider } from 'react-router-dom'

import { useState } from 'react'

import useThemeProvider from './Context/UseThemeProvider'
import { createRoutes } from './Routes/Routes'

export function App() {
  const [isDark, setIsDark] = useState(false)
  const routes = createRoutes(isDark, setIsDark)
  useThemeProvider()

  return <RouterProvider router={routes} />
}
