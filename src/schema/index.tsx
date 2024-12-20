import { z } from "zod";

export const createBasketSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Basket name must be filled" })
    .max(50, { message: "Basket name must be at most 50 characters long" }),
});
export const createStockSchema = z.object({
  basketId: z.string().min(1, { message: "Basket id must be filled" }),
  tickerId: z.string().min(1, { message: "Ticker is required" }),
  buyPrice: z.string().min(1, { message: "Buy price must be filled" }),
  quantity: z.string().min(1, { message: "Quantity must be filled" }),
  totalInvested: z.string(),
  brokerId: z.string().min(1, { message: "Broker is required" }),
  notes: z.string().optional(),
});
