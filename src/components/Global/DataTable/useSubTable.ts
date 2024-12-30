import { getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { useMemo } from 'react'

import { CustomColumnDef } from '@/pages/Portfolio/portfolio-utils/types'

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

export default useSubTable
