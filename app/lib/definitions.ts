import { z } from 'zod';
 
export type Inventory = {
    item_id: string,
    item_name: string,
    category_name: string,
    unit_name: string,
    vendor_name: string,
    qty_on_hand: string,
};

export const Inventory = z.object({
    item_id: z.number(),
    item_name: z.string(),
    category_name: z.string(),
    unit_name: z.string(),
    vendor_name: z.string(),
    qty_on_hand: z.number(),
});

export type UpdateItemProps = {
    id: string,
    location: string
};

export type ItemForm = {
    item_id: string;
    item_name: string;
    location_name: string;
    category_name: string;
    vendor_name: string;
    qty_on_hand: string;
};

export type Item = z.infer<typeof Inventory>