import debounce from 'lodash.debounce'
import { Search } from 'lucide-react'

import React, { useEffect, useMemo, useState } from 'react'

import { Input } from '../ui/input'

export const SearchInput = ({
  search,
  setSearchTerm,
  placeholder,
}: {
  search: string
  setSearchTerm: (searchTerm: string) => void
  placeholder?: string
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(search)

  // Create a memoized debounced function
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value)
      }, 500),
    [setSearchTerm],
  )

  // Handle input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearchTerm(value)
    debouncedSetSearch(value)
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel()
    }
  }, [debouncedSetSearch])

  // Sync local state with prop
  useEffect(() => {
    setLocalSearchTerm(search)
  }, [search])

  return (
    <div className="relative">
      <Search className="absolute right-2 top-2.5 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder || 'Search stocks...'}
        value={localSearchTerm}
        onChange={handleSearch}
        className="pr-10 w-full"
      />
    </div>
  )
}
