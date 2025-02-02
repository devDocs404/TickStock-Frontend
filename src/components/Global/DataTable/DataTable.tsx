import {
  type CellContext,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { AnimatePresence, motion } from 'framer-motion'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { PaginationType } from '@/Queries/queries-utils/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CustomColumnDef } from '@/pages/Portfolio/portfolio-utils/types'

import TableLoading from '../table-loading'
import TableControls from './TableControls'
import TablePagination from './TablePagination'
import TableTitle from './TableTitle'

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
    fetchSubData: Record<string, TSubData[]>
  }
  onRowClick?: (row: TData) => Promise<void> | void
}

export function DataTable<TData extends object, TSubData = unknown>({
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
  onRowClick,
}: DataTableProps<TData, TSubData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const handleRowClick = useCallback(
    async (rowId: string, row: TData) => {
      if (!tableSubDrop?.enabled) return

      await onRowClick?.(row)

      setExpandedRows(prev => {
        // If clicking the same row that's already open, close it
        if (prev[rowId]) {
          return {}
        }
        // Otherwise, close all rows and open only the clicked one
        return {
          [rowId]: true,
        }
      })
    },
    [onRowClick, tableSubDrop?.enabled],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  })

  useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map(row => row.original)
      onRowSelectionChange(selectedRows)
    }
  }, [rowSelection, onRowSelectionChange, table])

  const renderSubTableContent = useCallback(
    (rowId: string) => {
      const row = data.find((_, index) => `${index}` === rowId)
      if (!row) return null

      const actualId = (row as TData & { id: string }).id
      const subDataForRow = tableSubDrop?.fetchSubData[actualId]

      if (!subDataForRow || subDataForRow.length === 0) {
        return (
          <div className="text-center py-4 text-muted-foreground">
            No sub-data available
          </div>
        )
      }

      return (
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {tableSubDrop?.subColumns.map(column => (
                  <TableHead
                    key={column.id}
                    className="bg-muted/90 dark:bg-muted/30"
                  >
                    {typeof column.header === 'string'
                      ? column.header
                      : column.id}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {subDataForRow.map((subRow, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-muted/30 dark:hover:bg-muted/10 transition-colors"
                >
                  {tableSubDrop?.subColumns.map(column => (
                    <TableCell key={column.id}>
                      {(() => {
                        const value = subRow[column.id as keyof TSubData]
                        if (typeof column.cell === 'function') {
                          try {
                            return column.cell({
                              getValue: () => value,
                              row: { original: subRow },
                            } as CellContext<TSubData, unknown>)
                          } catch {
                            return String(value)
                          }
                        }
                        return String(value)
                      })()}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )
    },
    [tableSubDrop?.subColumns, tableSubDrop?.fetchSubData, data],
  )

  const renderTableContent = useMemo(() => {
    if (fetching && !placeholderData) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            <TableLoading />
          </TableCell>
        </TableRow>
      )
    }

    if (!table.getRowModel().rows?.length) {
      return (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            className="h-24 text-center text-muted-foreground"
          >
            No results.
          </TableCell>
        </TableRow>
      )
    }

    return table.getRowModel().rows.map(row => (
      <>
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() ? 'selected' : undefined}
          className={`
            ${tableSubDrop?.enabled ? 'cursor-pointer' : ''}
            ${expandedRows[row.id] ? '' : 'hover:bg-muted/30 dark:hover:bg-muted/10'}
          `}
          onClick={() => handleRowClick(row.id, row.original)}
        >
          {row.getVisibleCells().map(cell => (
            <TableCell
              key={cell.id}
              style={{ width: cell.column.columnDef.meta?.width || 'auto' }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
        <AnimatePresence>
          {expandedRows[row.id] && (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-0 border-0">
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-3">{renderSubTableContent(row.id)}</div>
                </motion.div>
              </TableCell>
            </TableRow>
          )}
        </AnimatePresence>
      </>
    ))
  }, [
    fetching,
    placeholderData,
    columns.length,
    table,
    tableSubDrop?.enabled,
    expandedRows,
    handleRowClick,
    renderSubTableContent,
  ])

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
        <div className="rounded-lg border border-border bg-card shadow-sm h-full flex flex-col">
          <div className="w-full flex-none">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map(header => (
                      <TableHead
                        key={header.id}
                        className="bg-muted/30 dark:bg-muted/10"
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

          <div className="flex-1 overflow-auto min-h-0">
            <Table>
              <TableBody>{renderTableContent}</TableBody>
            </Table>
          </div>
        </div>
      </div>
      <TablePagination pagination={pagination} />
    </div>
  )
}
