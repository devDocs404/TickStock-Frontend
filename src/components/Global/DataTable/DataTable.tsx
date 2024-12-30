import {
  type CellContext,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

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
    fetchSubData: (parentRow: TData) => Promise<TSubData[]>
  }
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
}: DataTableProps<TData, TSubData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [subData, setSubData] = useState<Record<string, TSubData[]>>({})
  const [loadingRows, setLoadingRows] = useState<Record<string, boolean>>({})

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
      if (loadingRows[rowId]) {
        return (
          <div className="flex justify-center py-4">
            <TableLoading />
          </div>
        )
      }

      if (!subData[rowId]) {
        return <div className="text-center py-4">No sub-data available</div>
      }

      return (
        <Table>
          <TableHeader>
            <TableRow>
              {tableSubDrop?.subColumns.map(column => (
                <TableHead key={column.id}>
                  {typeof column.header === 'string'
                    ? column.header
                    : column.id}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {subData[rowId].map((subRow, index) => (
              <TableRow key={index}>
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
      )
    },
    [loadingRows, subData, tableSubDrop?.subColumns],
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
          <TableCell colSpan={columns.length} className="h-24 text-center">
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
          className={
            tableSubDrop?.enabled ? 'cursor-pointer hover:bg-muted/50' : ''
          }
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
        {expandedRows[row.id] && (
          <TableRow>
            <TableCell colSpan={columns.length} className="p-0">
              <div className="bg-muted/50 p-4">
                {renderSubTableContent(row.id)}
              </div>
            </TableCell>
          </TableRow>
        )}
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
