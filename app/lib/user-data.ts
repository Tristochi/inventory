'use server'
import sql from 'mssql';
import {UserTable} from './definitions';

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
                email
            FROM users
            ORDER BY user_id DESC
        `);
        
        return result.recordset;
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
// Create new user
export async function createUser(userData: Omit<UserTable, 'user_id'>) {
    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        
        request.input('username', sql.VarChar, userData.username);
        request.input('password', sql.VarChar, userData.password); // will be hashed
        request.input('email', sql.VarChar, userData.email);
        request.input('created_at', sql.Date, userData.created_at);
    
     
        
        const result = await request.query(`
            INSERT INTO Users (username, password, created_on, email)
            VALUES (@username, @password, @created_on, @email)
        `);
        
        return result;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create user.');
    }
}

// Update user via last name or first name
export async function updateUser(username: String, email: String, userData: Partial<Omit<UserTable, 'user_id'>>) {
    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        
        request.input('username', sql.VarChar, username);
        request.input('email', sql.VarChar, email)

        const updates: string[] = [];
        
        if (userData.username !== undefined) {
            request.input('username', sql.VarChar, userData.username);
            updates.push('username = @username');
        }
        if (userData.password !== undefined) {
            request.input('password', sql.VarChar, userData.password);
            updates.push('password = @password');
        }
        if (userData.email !== undefined) {
            request.input('email', sql.VarChar, userData.email);
            updates.push('email = @email');
        }
        
        if (updates.length === 0) {
            throw new Error('No fields to update');
        }
        
        const result = await request.query(`
            UPDATE Users 
            SET ${updates.join(', ')}
            WHERE username = @Username
            OR
            WHERE email = @email
        `);
        
        return result;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update user.');
    }
}
export async function Login(username: String, password: String){

}
// Delete user //reconfig to work with button

// Login function (verify username and password) needs to be added with hashing
