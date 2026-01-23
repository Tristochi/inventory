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
};
const ITEMS_PER_PAGE = 6;

export async function fetchInventoryPages(query: string) {
    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        const likeQuery = `%${query}%`;

        request.input('query', sql.VarChar, likeQuery);

        const result = await request.query(`
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
                inventory.vendor LIKE @query COLLATE SQL_Latin1_General_CP1_CI_AS
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
  currentPage: number
): Promise<InventoryTable[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // ensure connection (uses pool internally)
    const pool = await sql.connect(sqlConfig);
    const request = pool.request();

    const likeQuery = `%${query}%`;

    request.input('query', sql.VarChar, likeQuery);
    request.input('limit', sql.Int, ITEMS_PER_PAGE);
    request.input('offset', sql.Int, offset);

    const result = await request.query(`
      SELECT
        inventory.item_id,
        inventory.item_name,
        inventory.category,
        inventory.unit,
        inventory.vendor,
        inventory.quantity
      FROM inventory
      WHERE
        inventory.item_id LIKE @query COLLATE SQL_Latin1_General_CP1_CI_AS OR
        inventory.item_name LIKE @query COLLATE SQL_Latin1_General_CP1_CI_AS OR
        inventory.category LIKE @query COLLATE SQL_Latin1_General_CP1_CI_AS OR
        inventory.unit LIKE @query COLLATE SQL_Latin1_General_CP1_CI_AS OR
        inventory.vendor LIKE @query COLLATE SQL_Latin1_General_CP1_CI_AS
      ORDER BY inventory.item_id DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `);

    return result.recordset;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch inventory.');
  }
}
