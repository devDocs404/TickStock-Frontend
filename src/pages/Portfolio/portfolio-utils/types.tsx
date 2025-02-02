import {
  ColumnDef,
  ColumnMeta as TanStackColumnMeta,
} from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    width?: string
  }
}

export type CustomColumnDef<TData> = ColumnDef<TData, unknown> & {
  meta?: TanStackColumnMeta<TData, unknown>
}

export type BasketType = {
  id: string
  userId: string
  name: string
  totalInvested: number
  createdAt: string
  updatedAt: string
  isActive: boolean
}

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

export type StockBasketDetailsType = {
  id: string
  basketId: string
  targetAllocation: number
  notes: string
  updatedAt: string
  tickerDetails: TickerDetailsType
}

export type StockBasket = {
  id: string
  basketId: string
  tickerId: string
  targetAllocation: number
  notes: string
  createdAt: string
  updatedAt: string
}

export type StocksType = {
  id: string
  stockBasketId: string
  buyPrice: number
  totalInvested: number
  quantity: number
  currency: string
  notes: string
  brokerId: string
  createdAt: string
  updatedAt: string
  stock_baskets: StockBasket
}

export interface StocksResponse extends StocksType {
  id: string
}

// export type TickerType = {
// 	symbolId: string;
// 	tickerName: string;
// 	exchange: string;
// };

export type TickerType = {
  symbolId: string
  yahooSymbol: string
  sector: string | null
  industry: string | null
  currency: string
  longName: string
  shortName: string | null
  exchange: string
  type: string
}

export type CreateStockPayload = {
  portfolioId: string
  tickerId: string
  brokerId: string
  buyPrice: number
  quantity: number
  totalInvested?: number
  notes?: string
}

export type CreatePortfolioPayload = {
  name: string
  riskLevel: number | null
  strategy: number | null
  description: string | null
  type: string
}

// Broker Types
export type BrokerType = {
  id: string
  brokerName: string
  commissionRate: number
}
