import { z } from 'zod'

export const createBasketSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Basket name must be filled' })
    .max(50, { message: 'Basket name must be at most 50 characters long' }),
})

export const createPortfolioSchema = z.object({
  name: z.string().min(1, { message: 'Portfolio name is required' }).max(100, {
    message: 'Portfolio name must be at most 100 characters long',
  }),
  riskLevel: z
    // .string().
    .number()
    .refine(
      val => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 5,
      {
        message: 'Risk level must be between 0 and 5',
      },
    )
    .nullable(),
  strategy: z
    .string()
    .max(100, {
      message: '*Portfolio strategy must be at most 100 characters long',
    })
    .nullable(),
  description: z
    .string()
    .max(100, { message: 'Description must be at most 100 characters long' })
    .nullable(),
  type: z.string().default('custom'),
})

export const sellPortfolioSchema = z.object({
  portfolioId: z.string().min(1, { message: 'Portfolio id must be filled' }),
  portfolioBasketId: z
    .string()
    .min(1, { message: 'Portfolio basket id must be filled' }),
  portfolioBasketStockId: z
    .string()
    .min(1, { message: 'Portfolio basket stock id must be filled' }),
  sellQuantity: z
    .number()
    .min(1, { message: 'Sell quantity must be filled' })
    .refine(
      val => {
        if (typeof window === 'undefined') return true
        const maxQuantity = (window as any).maxQuantity || 0
        return val <= maxQuantity
      },
      { message: 'Sell quantity cannot exceed available quantity' },
    ),
  sellPrice: z.number().min(1, { message: 'Sell price must be filled' }),
  brokerId: z.string().min(1, { message: 'Broker is required' }),
  tickerId: z.string().min(1, { message: 'Ticker is required' }),
})

export const createStockSchema = z.object({
  portfolioId: z.string().min(1, { message: 'Portfolio id must be filled' }),
  tickerId: z.string().min(1, { message: 'Ticker is required' }),
  buyPrice: z.number().min(1, { message: 'Buy price must be filled' }),
  quantity: z.number().min(1, { message: 'Quantity must be filled' }),
  totalInvested: z.number(),
  brokerId: z.string().min(1, { message: 'Broker is required' }),
  notes: z.string().optional(),
})
