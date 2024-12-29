import {
  Cell,
  CellContext,
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
import { ChevronDown, ChevronRight } from 'lucide-react'

import { useCallback, useEffect, useMemo, useState } from 'react'

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
import { SearchInput } from './search-input'
import TableLoading from './table-loading'

interface DataTableProps<TData, TSubData = unknown> {
  columns: CustomColumnDef<TData>[]
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
  tableSubDrop?: {
    enabled: boolean
    subColumns: CustomColumnDef<TSubData>[]
    fetchSubData: (parentRow: TData) => Promise<TSubData[]>
  }
}

// Extracted sub-components for better organization and performance
const TableTitle = ({ title }: { title?: string }) => {
  if (!title) return null
  return <div className="text-2xl font-bold m-0 p-0">{title}</div>
}

const TableControls = <TData,>({
  search,
  visibleColumn,
  table,
}: {
  search?: DataTableProps<TData>['search']
  visibleColumn?: boolean
  table: ReactTable<TData>
}) => {
  const visibleColumns = useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          column =>
            column.getCanHide() &&
            column.id !== 'actions' &&
            column.id !== 'select',
        ),
    [table],
  )

  return (
    <div className="flex items-center gap-2">
      {search && (
        <SearchInput
          search={search.searchTerm}
          setSearchTerm={search.setSearchTerm}
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
            {visibleColumns.map(column => (
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
      )}
    </div>
  )
}

const TablePagination = ({
  pagination,
}: {
  pagination?: DataTableProps<unknown>['pagination']
}) => {
  const handlePageChange = useCallback(
    (direction: 'prev' | 'next') => {
      if (!pagination?.setCurrentPage) return
      const currentValue = parseInt(pagination.currentPage || '1')
      const newValue =
        direction === 'prev' ? currentValue - 1 : currentValue + 1
      pagination.setCurrentPage(newValue.toString())
    },
    [pagination],
  )

  if (
    !pagination?.metadata?.totalPages ||
    parseInt(pagination.metadata.totalPages) <= 1
  ) {
    return null
  }

  return (
    <div className="flex items-center justify-end space-x-2 py-2 flex-none">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange('prev')}
        disabled={!pagination.metadata.hasPreviousPage}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange('next')}
        disabled={!pagination.metadata.hasNextPage}
      >
        Next
      </Button>
    </div>
  )
}

// Custom hook for sub-table
function useSubTable<TSubData>(
  subData: Record<string, TSubData[]>,
  subColumns: CustomColumnDef<TSubData>[] | undefined,
) {
  const table = useReactTable<TSubData>({
    data: subData[Object.keys(subData)[0]] || [],
    columns: subColumns || [],
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility: {},
      rowSelection: {},
      columnOrder: [],
      columnPinning: {},
      columnSizing: {},
      columnSizingInfo: {
        startOffset: null,
        startSize: null,
        deltaOffset: null,
        deltaPercentage: null,
        isResizingColumn: false,
        columnSizingStart: [],
      },
      expanded: {},
      grouping: [],
      globalFilter: '',
      pagination: { pageIndex: 0, pageSize: 10 },
      rowPinning: {},
      sorting: [],
    },
  })

  return useMemo(() => table, [table])
}

export function DataTable<TData, TSubData = unknown>({
  columns,
  data,
  onRowSelectionChange,
  pagination,
  search,
  visibleColumn,
  title,
  fetching,
  placeholderData,
  tableSubDrop,
}: DataTableProps<TData, TSubData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [subData, setSubData] = useState<Record<string, TSubData[]>>({})
  const [loadingRows, setLoadingRows] = useState<Record<string, boolean>>({})

  // Memoize columns with selection
  const modifiedColumns = useMemo(
    () => [
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
    ],
    [columns, onRowSelectionChange],
  )

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

  // Memoize row selection handler
  useEffect(() => {
    if (!onRowSelectionChange) return
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map(row => row.original)
    onRowSelectionChange(selectedRows)
  }, [rowSelection, onRowSelectionChange, table])

  // Memoize row click handler
  const handleRowClick = useCallback(
    async (rowId: string, row: TData) => {
      if (!tableSubDrop?.enabled) return

      setExpandedRows(prev => ({
        ...prev,
        [rowId]: !prev[rowId],
      }))

      if (!subData[rowId] && !loadingRows[rowId]) {
        setLoadingRows(prev => ({ ...prev, [rowId]: true }))
        try {
          const fetchedData = await tableSubDrop.fetchSubData(row)
          setSubData(prev => ({ ...prev, [rowId]: fetchedData }))
        } catch (error) {
          console.error('Error fetching sub data:', error)
        } finally {
          setLoadingRows(prev => ({ ...prev, [rowId]: false }))
        }
      }
    },
    [tableSubDrop, subData, loadingRows],
  )

  // Use the custom hook for sub-table
  const subTable = useSubTable(subData, tableSubDrop?.subColumns)

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 flex-none">
        <div className="flex items-center relative w-full justify-between mb-4">
          <TableTitle title={title} />
          <TableControls<TData>
            search={search}
            visibleColumn={visibleColumn}
            table={table}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="rounded-md border h-full flex flex-col">
          <div className="w-full flex-none">
            <Table>
              <TableHeader className="bg-background">
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
            </Table>
          </div>
          <div
            className="flex-1 overflow-auto min-h-0
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gradient-to-b
            [&::-webkit-scrollbar-thumb]:from-purple-400
            [&::-webkit-scrollbar-thumb]:via-pink-500
            [&::-webkit-scrollbar-thumb]:to-red-500
            [&::-webkit-scrollbar-thumb]:rounded-full
            dark:[&::-webkit-scrollbar-thumb]:from-purple-600
            dark:[&::-webkit-scrollbar-thumb]:via-pink-700
            dark:[&::-webkit-scrollbar-thumb]:to-red-700
            hover:[&::-webkit-scrollbar-thumb]:bg-gradient-to-b
            hover:[&::-webkit-scrollbar-thumb]:from-purple-500
            hover:[&::-webkit-scrollbar-thumb]:via-pink-600
            hover:[&::-webkit-scrollbar-thumb]:to-red-600
            dark:hover:[&::-webkit-scrollbar-thumb]:from-purple-500
            dark:hover:[&::-webkit-scrollbar-thumb]:via-pink-600
            dark:hover:[&::-webkit-scrollbar-thumb]:to-red-600
            [&::-webkit-scrollbar-thumb]:border-4
            [&::-webkit-scrollbar-thumb]:border-transparent
            [&::-webkit-scrollbar-thumb]:bg-clip-padding
            [&::-webkit-scrollbar-thumb]:min-h-[40px]"
          >
            <Table>
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
                    <>
                      <TableRow
                        key={row.id}
                        data-state={
                          row.getIsSelected() ? 'selected' : undefined
                        }
                        className={`cursor-pointer ${
                          tableSubDrop?.enabled ? 'hover:bg-muted/50' : ''
                        }`}
                        onClick={() => handleRowClick(row.id, row.original)}
                      >
                        {row.getVisibleCells().map((cell, index) => (
                          <TableCell
                            key={cell.id}
                            style={{
                              width:
                                cell.column.columnDef.meta?.width || 'auto',
                            }}
                          >
                            {index === 0 && tableSubDrop?.enabled && (
                              <span className="mr-2 inline-block">
                                {expandedRows[row.id] ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </span>
                            )}
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {expandedRows[row.id] && (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="p-0">
                            <div className="bg-muted/50 p-4">
                              {loadingRows[row.id] ? (
                                <div className="flex justify-center py-4">
                                  <TableLoading />
                                </div>
                              ) : subData[row.id] ? (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      {subTable.getAllColumns().map(column => (
                                        <TableHead key={column.id}>
                                          {typeof column.columnDef.header ===
                                          'string'
                                            ? column.columnDef.header
                                            : column.id}
                                        </TableHead>
                                      ))}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {subData[row.id].map((subRow, index) => (
                                      <TableRow key={index}>
                                        {subTable
                                          .getAllColumns()
                                          .map(column => (
                                            <TableCell key={column.id}>
                                              {(() => {
                                                const value =
                                                  subRow[
                                                    column.id as keyof TSubData
                                                  ]
                                                if (
                                                  column.columnDef.cell &&
                                                  typeof column.columnDef
                                                    .cell === 'function'
                                                ) {
                                                  return column.columnDef.cell({
                                                    getValue: () =>
                                                      value as unknown,
                                                    row: {
                                                      original: subRow,
                                                    } as unknown as Row<TSubData>,
                                                    column,
                                                    table: subTable,
                                                    renderValue: () =>
                                                      value as unknown,
                                                    cell: {
                                                      id: `${index}-${column.id}`,
                                                      getValue: () =>
                                                        value as unknown,
                                                      renderValue: () =>
                                                        value as unknown,
                                                    } as unknown as Cell<
                                                      TSubData,
                                                      unknown
                                                    >,
                                                  } as CellContext<
                                                    TSubData,
                                                    unknown
                                                  >)
                                                }
                                                return value
                                              })()}
                                            </TableCell>
                                          ))}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              ) : (
                                <div className="text-center py-4">
                                  No sub-data available
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
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
        </div>
      </div>

      <TablePagination pagination={pagination} />
    </div>
  )
}
