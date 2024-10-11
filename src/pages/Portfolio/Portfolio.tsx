import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Basket {
  id: string;
  name: string;
}

interface Stock {
  id: string;
  name: string;
  symbol: string;
  price: number;
  basketId: string;
}

const BasketForm = ({ newBasket, setNewBasket, handleCreateBasket }) => (
  <form onSubmit={handleCreateBasket} className="space-y-4">
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="basketName">Basket Name</Label>
      <Input
        type="text"
        id="basketName"
        value={newBasket.name}
        onChange={(e) => setNewBasket({ ...newBasket, name: e.target.value })}
        placeholder="Enter basket name"
      />
    </div>
    <Button type="submit">{newBasket.id ? "Update" : "Create"} Basket</Button>
  </form>
);

const StockForm = ({ newStock, setNewStock, handleCreateStock, baskets }) => (
  <form onSubmit={handleCreateStock} className="space-y-4">
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="stockName">Stock Name</Label>
      <Input
        type="text"
        id="stockName"
        value={newStock.name}
        onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
        placeholder="Enter stock name"
      />
    </div>
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="stockSymbol">Stock Symbol</Label>
      <Input
        type="text"
        id="stockSymbol"
        value={newStock.symbol}
        onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
        placeholder="Enter stock symbol"
      />
    </div>
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="stockPrice">Stock Price</Label>
      <Input
        type="number"
        id="stockPrice"
        value={newStock.price}
        onChange={(e) => setNewStock({ ...newStock, price: e.target.value })}
        placeholder="Enter stock price"
      />
    </div>
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="stockBasket">Assign to Basket</Label>
      <Select
        value={newStock.basketId}
        onValueChange={(value) => setNewStock({ ...newStock, basketId: value })}
      >
        <SelectTrigger id="stockBasket">
          <SelectValue placeholder="Select a basket" />
        </SelectTrigger>
        <SelectContent>
          {baskets.map((basket) => (
            <SelectItem key={basket.id} value={basket.id}>
              {basket.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <Button type="submit">{newStock.id ? "Update" : "Create"} Stock</Button>
  </form>
);

const StockTable = ({
  paginatedStocks,
  baskets,
  handleEditStock,
  handleDeleteStock,
  sortConfig,
  requestSort,
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead
          className="cursor-pointer"
          onClick={() => requestSort("name")}
        >
          Name{" "}
          {sortConfig.key === "name" &&
            (sortConfig.direction === "ascending" ? "▲" : "▼")}
        </TableHead>
        <TableHead
          className="cursor-pointer"
          onClick={() => requestSort("symbol")}
        >
          Symbol{" "}
          {sortConfig.key === "symbol" &&
            (sortConfig.direction === "ascending" ? "▲" : "▼")}
        </TableHead>
        <TableHead
          className="cursor-pointer"
          onClick={() => requestSort("price")}
        >
          Price{" "}
          {sortConfig.key === "price" &&
            (sortConfig.direction === "ascending" ? "▲" : "▼")}
        </TableHead>
        <TableHead>Basket</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <AnimatePresence>
        {paginatedStocks.map((stock) => (
          <motion.tr
            key={stock.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TableCell>{stock.name}</TableCell>
            <TableCell>{stock.symbol}</TableCell>
            <TableCell>${stock.price.toFixed(2)}</TableCell>
            <TableCell>
              {baskets.find((basket) => basket.id === stock.basketId)?.name}
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
);

const BasketTable = ({
  baskets,
  stocks,
  handleEditBasket,
  handleDeleteBasket,
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
        {baskets.map((basket) => (
          <motion.tr
            key={basket.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TableCell>{basket.name}</TableCell>
            <TableCell>
              {stocks.filter((stock) => stock.basketId === basket.id).length}
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

const Portfolio = () => {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [newBasket, setNewBasket] = useState({ id: "", name: "" });
  const [newStock, setNewStock] = useState({
    id: "",
    name: "",
    symbol: "",
    price: "",
    basketId: "",
  });
  const [selectedBasket, setSelectedBasket] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [isBasketDialogOpen, setIsBasketDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBasket, searchTerm]);

  const handleCreateBasket = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBasket.name) {
      if (newBasket.id) {
        setBaskets(
          baskets.map((b) =>
            b.id === newBasket.id ? { ...b, name: newBasket.name } : b
          )
        );
      } else {
        setBaskets([
          ...baskets,
          { id: Date.now().toString(), name: newBasket.name },
        ]);
      }
      setNewBasket({ id: "", name: "" });
      setIsBasketDialogOpen(false);
    }
  };

  const handleCreateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newStock.name &&
      newStock.symbol &&
      newStock.price &&
      newStock.basketId
    ) {
      const stock: Stock = {
        id: newStock.id || Date.now().toString(),
        name: newStock.name,
        symbol: newStock.symbol,
        price: parseFloat(newStock.price),
        basketId: newStock.basketId,
      };
      if (newStock.id) {
        setStocks(stocks.map((s) => (s.id === newStock.id ? stock : s)));
      } else {
        setStocks([...stocks, stock]);
      }
      setNewStock({ id: "", name: "", symbol: "", price: "", basketId: "" });
      setIsStockDialogOpen(false);
    }
  };

  const handleEditBasket = (basket: Basket) => {
    setNewBasket(basket);
    setIsBasketDialogOpen(true);
  };

  const handleEditStock = (stock: Stock) => {
    setNewStock({ ...stock, price: stock.price.toString() });
    setIsStockDialogOpen(true);
  };

  const handleDeleteBasket = (id: string) => {
    setBaskets(baskets.filter((b) => b.id !== id));
    setStocks(stocks.filter((s) => s.basketId !== id));
  };

  const handleDeleteStock = (id: string) => {
    setStocks(stocks.filter((s) => s.id !== id));
  };

  const filteredStocks = stocks
    .filter(
      (stock) =>
        (selectedBasket === "all" || stock.basketId === selectedBasket) &&
        (stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortConfig.key === "") return 0;
      const aValue = a[sortConfig.key as keyof Stock];
      const bValue = b[sortConfig.key as keyof Stock];
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });

  const pageCount = Math.ceil(filteredStocks.length / itemsPerPage);
  const paginatedStocks = filteredStocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof Stock) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mx-auto w-full p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          <CardHeader>
            <CardTitle className="text-white text-3xl font-bold">
              Stock Portfolio Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <Dialog
              open={isBasketDialogOpen}
              onOpenChange={setIsBasketDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <Plus className="mr-2 h-4 w-4" /> Create Basket
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {newBasket.id ? "Edit Basket" : "Create Basket"}
                  </DialogTitle>
                </DialogHeader>
                <BasketForm
                  newBasket={newBasket}
                  setNewBasket={setNewBasket}
                  handleCreateBasket={handleCreateBasket}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              open={isStockDialogOpen}
              onOpenChange={setIsStockDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <Plus className="mr-2 h-4 w-4" /> Create Stock
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {newStock.id ? "Edit Stock" : "Create Stock"}
                  </DialogTitle>
                </DialogHeader>
                <StockForm
                  newStock={newStock}
                  setNewStock={setNewStock}
                  handleCreateStock={handleCreateStock}
                  baskets={baskets}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>View Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="filterBasket">Filter by Basket</Label>
                <Select
                  value={selectedBasket}
                  onValueChange={setSelectedBasket}
                >
                  <SelectTrigger id="filterBasket" className="w-[200px]">
                    <SelectValue placeholder="Select a basket" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Baskets</SelectItem>
                    {baskets.map((basket) => (
                      <SelectItem key={basket.id} value={basket.id}>
                        {basket.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <StockTable
              paginatedStocks={paginatedStocks}
              baskets={baskets}
              handleEditStock={handleEditStock}
              handleDeleteStock={handleDeleteStock}
              sortConfig={sortConfig}
              requestSort={requestSort}
            />
            <div className="flex justify-between items-center mt-4">
              <div>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredStocks.length)} of{" "}
                {filteredStocks.length} entries
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, pageCount))
                  }
                  disabled={currentPage === pageCount}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>View Baskets</CardTitle>
          </CardHeader>
          <CardContent>
            <BasketTable
              baskets={baskets}
              stocks={stocks}
              handleEditBasket={handleEditBasket}
              handleDeleteBasket={handleDeleteBasket}
            />
            <div className="mt-4">
              Total number of baskets: {baskets.length}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Portfolio;
