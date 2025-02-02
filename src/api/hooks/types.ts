export type TickerDetailsType = {
  symbolId: string
  yahooSymbol: string
  sector: string
  industry: string
  currency: string
  longName: string
  shortName: string
  exchange: string
  type: string
  isActive: number
}

export type PortfolioStocksResponse = {
  id: string
  portfolioId: string
  tickerId: string
  targetAllocation: number
  totalStocks: number
  currentAllocation: number
  notes: string
  createdAt: string
  updatedAt: string
  deletedAt: number
  tickerDetails?: TickerDetailsType
}

export type StockRowDataType = {
  id: string
  portfolioBasketId: string
  buyPrice: number
  totalInvested: number
  quantity: number
  currency: 'INR' | 'USD' | 'EUR' | 'GBP'
  notes: string
  brokerId: string
  exchangeRate: number
  createdAt: number
  updatedAt: number
  tickerDetails: TickerDetailsType
  broker: string
}

// export type StockRowDataType = {
//   id: string
//   portfolioBasketId: string
//   buyPrice: number
//   totalInvested: number
//   quantity: number
//   currency: 'INR' | 'USD' | 'EUR' | 'GBP'
//   notes: string
//   brokerId: string
//   exchangeRate: number
//   createdAt: number
//   updatedAt: number
//   tickerDetails: TickerType
//   broker: string
// }
