import { z } from 'zod';
 
export const Inventory = z.object({
    item_id: z.number(),
    item_name: z.string(),
    category_name: z.string(),
    unit_name: z.string(),
    vendor_name: z.string(),
    qty_on_hand: z.number(),
});

export type Item = z.infer<typeof Inventory>