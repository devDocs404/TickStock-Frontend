import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface Basket {
  id: string;
  name: string;
}
interface Stock {
  id: string;
  name: string;
  basketId: string;
}

const BasketTable = ({
  baskets,
  stocks,
  handleEditBasket,
  handleDeleteBasket,
}: {
  baskets: Basket[];
  stocks: Stock[];
  handleEditBasket: (basket: Basket) => void;
  handleDeleteBasket: (id: string) => void;
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Basket Name</TableHead>
        <TableHead>Number of Stocks</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <AnimatePresence>
        {baskets.map(basket => (
          <motion.tr
            key={basket.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TableCell>{basket.name}</TableCell>
            <TableCell>
              {stocks.filter(stock => stock.basketId === basket.id).length}
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
                    onClick={() => handleEditBasket(basket)}
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
                    onClick={() => handleDeleteBasket(basket.id)}
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
);

export default BasketTable;
