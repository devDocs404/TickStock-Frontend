import { Column, Table } from '@tanstack/react-table'

import { memo, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { SearchInput } from '../search-input'

const MemoizedSearchInput = memo(SearchInput)

interface TableControlsProps<TData extends object> {
  search?: { searchTerm: string; setSearchTerm: (searchTerm: string) => void }
  visibleColumn?: boolean
  table: Table<TData>
}

function TableControlsComponent<TData extends object>({
  search,
  visibleColumn,
  table,
}: TableControlsProps<TData>) {
  const visibleColumns = useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (column: Column<TData>) =>
            column.getCanHide() &&
            column.id !== 'actions' &&
            column.id !== 'select',
        ),
    [table],
  )

  const columnVisibilityControls = useMemo(
    () =>
      visibleColumn && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns Visibility
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {visibleColumns.map((column: Column<TData>) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={value => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    [visibleColumn, visibleColumns],
  )

  return (
    <div className="flex items-center gap-2">
      {search && (
        <MemoizedSearchInput
          search={search.searchTerm}
          setSearchTerm={search.setSearchTerm}
        />
      )}
      {columnVisibilityControls}
    </div>
  )
}

const TableControls = memo(TableControlsComponent) as <TData extends object>(
  props: TableControlsProps<TData>,
) => JSX.Element

export default TableControls
