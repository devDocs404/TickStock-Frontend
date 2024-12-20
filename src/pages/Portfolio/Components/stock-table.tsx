import { AnimatePresence, motion } from 'framer-motion'
import { Edit, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Stock {
  id: string
  name: string
  symbol: string
  price: string
  basketId: string
}
interface Basket {
  id: string
  name: string
}

const StockTable = ({
  paginatedStocks,
  baskets,
  handleEditStock,
  handleDeleteStock,
  sortConfig,
  requestSort,
}: {
  paginatedStocks: Stock[]
  baskets: Basket[]
  handleEditStock: (stock: Stock) => void
  handleDeleteStock: (id: string) => void
  sortConfig: { key: string; direction: string }
  requestSort: (key: keyof Stock) => void
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead
          className="cursor-pointer"
          onClick={() => requestSort('name')}
        >
          Name{' '}
          {sortConfig.key === 'name' &&
            (sortConfig.direction === 'ascending' ? '▲' : '▼')}
        </TableHead>
        <TableHead
          className="cursor-pointer"
          onClick={() => requestSort('symbol')}
        >
          Symbol{' '}
          {sortConfig.key === 'symbol' &&
            (sortConfig.direction === 'ascending' ? '▲' : '▼')}
        </TableHead>
        <TableHead
          className="cursor-pointer"
          onClick={() => requestSort('price')}
        >
          Price{' '}
          {sortConfig.key === 'price' &&
            (sortConfig.direction === 'ascending' ? '▲' : '▼')}
        </TableHead>
        <TableHead>Basket</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <AnimatePresence>
        {paginatedStocks.map(stock => (
          <motion.tr
            key={stock.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TableCell>{stock.name}</TableCell>
            <TableCell>{stock.symbol}</TableCell>
            <TableCell>${stock.price}</TableCell>
            <TableCell>
              {baskets.find(basket => basket.id === stock.basketId)?.name}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditStock(stock)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteStock(stock.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </TableCell>
          </motion.tr>
        ))}
      </AnimatePresence>
    </TableBody>
  </Table>
)

export default StockTable
