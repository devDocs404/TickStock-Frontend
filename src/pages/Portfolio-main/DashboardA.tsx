'use client'

import { useState } from 'react'

import MainContent from './Components/MainContent'
import Portfolio from './Components/Portfolio'

export default function DashboardA() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeStock, setActiveStock] = useState({
    id: '',
    name: '',
    description: '',
  })
  const [search, setSearch] = useState('')
  return (
    <div className="flex flex-col lg:flex-row h-full relative">
      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Portfolio Sidebar */}
      <div
        className={`
          fixed lg:relative lg:z-0
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          lg:order-first h-full
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          ${!sidebarOpen && 'lg:block hidden'}
          inset-y-0 right-0 lg:right-auto lg:left-0 z-50
          w-[360px]
        `}
      >
        <Portfolio
          activeStock={activeStock}
          setActiveStock={setActiveStock}
          setSidebarOpen={setSidebarOpen}
          search={search}
          setSearch={setSearch}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full">
        <MainContent
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeStock={activeStock}
        />
      </div>
    </div>
  )
}
