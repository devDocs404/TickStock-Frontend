import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const StockTicker = () => {
  const [tickerWidth, setTickerWidth] = useState(0);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tickerRef.current) {
      setTickerWidth(tickerRef.current.scrollWidth / 2);
    }
  }, []);

  const stocks = [
    { symbol: "AAPL", price: 150.25, change: 2.5 },
    { symbol: "GOOGL", price: 2750.8, change: -0.8 },
    { symbol: "MSFT", price: 305.15, change: 1.2 },
    { symbol: "AMZN", price: 3380.5, change: 0.5 },
    { symbol: "FB", price: 325.75, change: -1.5 },
  ];

  return (
    <div className="overflow-hidden whitespace-nowrap mt-8">
      <motion.div
        ref={tickerRef}
        className="inline-block"
        animate={{
          x: [-tickerWidth, 0],
          transition: {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          },
        }}
      >
        {[...stocks, ...stocks].map((stock, index) => (
          <span key={index} className="inline-block mr-8">
            <span className="font-semibold">{stock.symbol}</span>
            <span className="ml-2">${stock.price.toFixed(2)}</span>
            <span
              className={`ml-2 ${
                stock.change >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(2)}%
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default StockTicker;
