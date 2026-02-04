'use server'
import sql from 'mssql';
import {UserTable} from './definitions';
import { mockUsers } from '@/app/lib/mockUsers';

const users = mockUsers

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
        encrypt: true, 
        trustServerCertificate: true  
    }
};

// Fetch all users- I dont imagine we will need pagination since there wont be many users but I can add it if you want
export async function fetchAllUsers(): Promise<UserTable[]> {
    try {
        const pool = await sql.connect(sqlConfig);//conect to db
        const request = pool.request();//create request
        
        const result = await request.query(`
            SELECT 
                user_id,
                username,
                password,
                email_address
            FROM users
            ORDER BY user_id DESC
        `);
        
        return result.recordset as UserTable[]
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch users.');
    }
}

// Fetch single user by ID probably not useful??? idk
export async function fetchUserById(userId: number): Promise<UserTable | null> {
    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        
        request.input('user_id', sql.Int, userId);
        
        const result = await request.query(`
            SELECT 
                user_id,
                username,
                password,
                email,
               
            FROM Users
            WHERE user_id = @user_id
        `);
        
        return result.recordset[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user.');
    }
}
//search user by email, username 
export async function searchUsers(searchQuery: string): Promise<UserTable[]> {
    const likeQuery = `%${searchQuery}%`;
    
    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        
        request.input('query', sql.VarChar, likeQuery);
        
        const result = await request.query(`
            SELECT *
            FROM Users
            WHERE 
                username LIKE @query OR
                email LIKE @query 
        `);
        
        return result.recordset;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to search users.');
    }
}

