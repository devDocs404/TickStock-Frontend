export type BasketType = {
  id: string;
  userId: string;
  basketName: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};
export interface StocksType {
  basketId: string;
  tickerId: string;
  buyDate: string;
  buyPrice: string;
  quantity: string;
  investedAmount: string;
  sellDate: string | null;
  sellPrice: string | null;
  totalReturn: string | null;
  totalInvestedDays: string | null;
  brokerName: string;
  tradeType: string | null;
  notes: string | null | undefined;
  sellQuantity: string | null;
}

export interface StocksResponse extends StocksType {
  id: string;
}

export type TickerType = {
  symbolId: string;
  tickerName: string;
  exchange: string;
};
