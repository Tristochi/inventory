'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import sql from 'mssql';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

const sqlConfig: sql.config = {
    user: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    database: requireEnv('DB_DATABASE'),
    server: requireEnv('DB_SERVER'),
    options: {
      encrypt: false,
      trustServerCertificate: true
    }
};

const FormSchema = z.object({
    item_id: z.number(),
    item_name: z.string(),
    location_name: z.string(),
    category_name: z.string(),
    unit_name: z.string(),
    vendor_name: z.string(),
    qty_on_hand: z.coerce
        .number()
        .gt(-1, "Please enter an amount greater than 0."),
});

const UpdateItem = FormSchema.omit({item_id:true, unit_name: true})

export type State = {
    errors?: {
        item_name?: string[];
        location_name?: string[];
        category_name?: string[];
        vendor_name?: string[];
        qty_on_hand?: string[];
    };
    message?: string | null;
};



export async function updateItem(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateItem.safeParse({
        item_name: formData.get('item_name'),
        location_name: formData.get('location_name'),
        category_name: formData.get('category_name'),
        vendor_name: formData.get('vendor_name'),
        qty_on_hand: formData.get('qty_on_hand'),
    });

    if(!validatedFields.success){
        return {
            //errors: z.treeifyError(validatedFields.error),
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        }
    }

    const { item_name, location_name, category_name, vendor_name, qty_on_hand } = UpdateItem.parse({
        item_name: formData.get('item_name'),
        location_name: formData.get('location_name'),
        category_name: formData.get('category_name'),
        vendor_name: formData.get('vendor_name'),
        qty_on_hand: formData.get('qty_on_hand'),        
    });

    try{
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        request.input('item_id', sql.Int, id);
        request.input('item_name', sql.VarChar, item_name);
        request.input('location_name', sql.VarChar, location_name);
        request.input('category_name', sql.VarChar, category_name);
        request.input('vendor_name', sql.VarChar, vendor_name);
        request.input('qty_on_hand', sql.Decimal, qty_on_hand);

        const category = await request.query(`
            use vns_inventory;
            SELECT category_id FROM category WHERE category_name = @category_name
            `);
        const category_id = category.recordset[0].category_id;
        const vendor = await request.query(`
                use vns_inventory;
                SELECT vendor_id FROM vendor WHERE vendor_name = @vendor_name
            `);
        const vendor_id = vendor.recordset[0].vendor_id;
        request.input('vendor_id', sql.Int, vendor_id);
        const location = await request.query(`
                USE vns_inventory;
                SELECT location_id FROM location WHERE location_name = @location_name;
            `)
        const location_id = location.recordset[0].location_id 
        request.input('location_id', sql.Int, location_id);

        const itemLocationQtyUpdate = await request.query(`
                USE vns_inventory;
                UPDATE itemlocation
                SET qty_units_on_hand = @qty_on_hand
                WHERE itemlocation.item_id = @item_id
                    AND itemlocation.location_id = @location_id
                    AND qty_units_on_hand <> @qty_on_hand; 
            `);

        if (itemLocationQtyUpdate.rowsAffected[0] > 0){
            console.log('Quantity on hand updated.');
        }

        const vendorUpdate = await request.query(`
                USE vns_inventory;
                UPDATE item 
                SET vendor_id = @vendor_id
                WHERE item_id = @item_id
                    AND vendor_id <> @vendor_id;
            `);
        
        if (vendorUpdate.rowsAffected[0] > 0){
            console.log("Item's vendor updated.");
        }

    }catch(error){
        console.error(error);
        return{
            message: 'Database Error: Failed to Update Item.',
        };
    }

    if(location_name === "Main Office"){
        revalidatePath('/inventory/main-office');
        redirect('/inventory/main-office');       
    } else if (location_name === "Hospice House"){
        revalidatePath('/inventory/hospice-house');
        redirect('/inventory/hospice-house');          
    } else if(location_name ==="hospice-overflow"){
        revalidatePath('/inventory/hospice-overflow');
        redirect('/inventory/hospice-overlflow');          
    } else {
        revalidatePath('/inventory');
        redirect('/inventory');  
    }

}


