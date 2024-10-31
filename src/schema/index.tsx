import { z } from 'zod';

export const createBasketSchema = z.object({
  basketName: z
    .string()
    .min(1, { message: 'Basket name must be filled' })
    .max(50, { message: 'Basket name must be at most 50 characters long' }),
});
export const createStockSchema = z.object({
  basketId: z.string().min(1, { message: 'Basket id must be filled' }),
  tickerId: z.string().min(1, { message: 'Ticker is required' }),
  buyPrice: z.string().min(1, { message: 'Buy price must be filled' }),
  quantity: z.string().min(1, { message: 'Quantity must be filled' }),
  brokerName: z.string().min(1, { message: 'Broker is required' }),
  sellDetails: z.boolean().optional(),
  sellDate: z.date().optional(),
  sellPrice: z.string().optional(),
  totalReturn: z.string().optional(),
  totalInvestedDays: z.string().optional(),
  sellQuantity: z.string().optional(),
  notes: z.string().optional(),
  buyDate: z.date(),
});
