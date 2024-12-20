import {
  Table as ReactTable,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { useEffect, useState } from 'react'

import { PaginationType } from '@/Queries/queries-utils/types'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CustomColumnDef } from '@/pages/Portfolio/portfolio-utils/types'

import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import TableLoading from './Table-Loading'
import { SearchInput } from './search-input'

interface DataTableProps<TData> {
  columns: CustomColumnDef<TData>[] // Use the corrected CustomColumnDef type
  data: TData[]
  onRowSelectionChange?: (selectedRows: TData[]) => void
  pagination?: {
    metadata: PaginationType | undefined
    currentPage: string | '1'
    setCurrentPage: (currentPage: string) => void
  }
  search?: {
    searchTerm: string
    setSearchTerm: (searchTerm: string) => void
  }
  visibleColumn?: boolean
  title?: string
  fetching?: boolean
  placeholderData?: boolean
}

export function DataTable<TData>({
  columns,
  data,
  onRowSelectionChange,
  pagination,
  search,
  visibleColumn,
  title,
  fetching,
  placeholderData,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)
  const [totalItems, setTotalItems] = useState('0')

  useEffect(() => {
    if (pagination?.metadata) {
      setHasNextPage(pagination?.metadata?.hasNextPage || false)
      setHasPreviousPage(pagination?.metadata?.hasPreviousPage || false)
      setTotalItems(pagination?.metadata?.totalItems || '0')
    }
  }, [pagination])

  // Dynamically add the select column if onRowSelectionChange is defined
  const modifiedColumns = [
    ...(onRowSelectionChange
      ? [
          {
            id: 'select',
            header: ({ table }: { table: ReactTable<TData> }) => (
              <Checkbox
                checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={value =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            ),
            cell: ({ row }: { row: Row<TData> }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            ),
            enableSorting: false,
            enableHiding: true,
          },
        ]
      : []),
    ...columns,
  ]

  const table = useReactTable({
    data,
    columns: modifiedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
    },
  })

  useEffect(() => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map(row => row.original)
    onRowSelectionChange?.(selectedRows)
  }, [rowSelection, onRowSelectionChange, table])

  return (
    <div className="p-3">
      <div className="flex items-center relative w-full justify-between mb-4">
        {title && <div className="text-2xl font-bold m-0 p-0">{title}</div>}

        <div className="flex items-center gap-2">
          {search && (
            <SearchInput
              search={search?.searchTerm}
              setSearchTerm={search?.setSearchTerm}
            />
          )}

          {visibleColumn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns Visibility
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter(
                    column =>
                      column.getCanHide() &&
                      column.id !== 'actions' &&
                      column.id !== 'select',
                  )
                  .map(column => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={value =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.column.columnDef.meta?.width || 'auto',
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {fetching && !placeholderData ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <TableLoading />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.columnDef.meta?.width || 'auto',
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {parseInt(totalItems) > 10 && pagination?.currentPage && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const value = parseInt(pagination?.currentPage) - 1
              pagination?.setCurrentPage(value?.toString())
            }}
            disabled={!hasPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const value = parseInt(pagination?.currentPage) + 1
              pagination?.setCurrentPage(value.toString())
            }}
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
