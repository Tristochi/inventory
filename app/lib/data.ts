import sql from 'mssql';
import {
    InventoryTable
} from './definitions';

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
const ITEMS_PER_PAGE = 6;

export async function fetchInventoryPages(query: string) {
    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        const likeQuery = `%${query}%`;

        request.input('query', sql.VarChar, likeQuery);

        const result = await request.query(`
            use vns_inventory;
            SELECT COUNT(*) AS count
            FROM itemlocation
            JOIN location
              ON itemlocation.location_id = location.location_id
            JOIN item 
              ON itemlocation.item_id = item.item_id 
            JOIN category
              ON item.category_id = category.category_id 
            JOIN UnitOfMeasure
              ON item.unit_id = UnitOfMeasure.unit_id 
            JOIN Vendor 
              ON item.vendor_id = vendor.vendor_id 
            WHERE 
                itemlocation.item_id LIKE @query COLLATE SQL_Latin1_General_CP1_CI_AS OR 
                item.item_name LIKE @query COLLATE SQL_Latin1_General_CP1_CI_AS OR
                category.category_name LIKE @query COLLATE SQL_Latin1_General_CP1_CI_AS OR
                UnitOfMeasure.unit_name LIKE @query COLLATE SQL_Latin1_General_CP1_CI_AS OR
                vendor.vendor_name LIKE @query COLLATE SQL_Latin1_General_CP1_CI_AS
        `);
        const totalPages = Math.ceil(Number(result.recordset[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch total number of inventoried items.');
    }
}

export async function fetchFilteredInventory(
  query: string,
  currentPage: number,
  location: string
): Promise<InventoryTable[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  try {
    // ensure connection (uses pool internally)
    const pool = await sql.connect(sqlConfig);
    const request = pool.request();

    const likeQuery = `%${query}%`;
    const likeLocation = `${location}`
    
    request.input('query', sql.VarChar, likeQuery);
    request.input('limit', sql.Int, ITEMS_PER_PAGE);
    request.input('offset', sql.Int, offset);
    request.input('location', sql.VarChar, likeLocation)

    const result = await request.query(`
      SELECT
        itemlocation.item_id,
        item.item_name,
        itemlocation.qty_units_on_hand,
        unitofmeasure.unit_name,
        vendor.vendor_name,
        category.category_name
      FROM itemlocation
      JOIN item 
        ON itemlocation.item_id = item.item_id 
      JOIN location
        ON itemlocation.location_id = location.location_id
      JOIN category
        ON item.category_id = category.category_id
      JOIN vendor 
        ON item.vendor_id = vendor.vendor_id 
      JOIN unitofmeasure
        ON item.unit_id = unitofmeasure.unit_id 
      WHERE
        
        location.location_name = @location COLLATE SQL_Latin1_General_CP1_CI_AS
      ORDER BY itemlocation.item_id DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `);
    await pool.close();  
    return result.recordset;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch inventory.');
  }
}
