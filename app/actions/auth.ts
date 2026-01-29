'use server'
import { createSession, deleteSession } from '@/app/lib/sessions'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import sql from 'mssql';
import {UserTable} from '@/app/lib/definitions';

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

// Create new user
export async function createUser(formData: FormData) {
    const date = new Date()
    const currentDate = date.toISOString()

    const userData = {
        username: formData.get('username') as string,
        password: formData.get('password') as string,
        email: formData.get('email') as string,
    }
    
    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        
        // Hash password before storing
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        request.input('username', sql.VarChar, userData.username);
        request.input('password', sql.VarChar, hashedPassword);
        request.input('email', sql.VarChar, userData.email);
        request.input('created_at', sql.DateTime, currentDate);
        
        const result = await request.query(`
            INSERT INTO Users (username, password, created_on, email)
            OUTPUT INSERTED.user_id
            VALUES (@username, @password, @created_at, @email)
        `);
        
        const userId = result.recordset[0].user_id;
        
        // Create session for the new user
        await createSession(userId.toString());
        
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create user.');
    }
}

// Update user via last name or first name
export async function updateUser(formData: FormData) {
    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        
        // Get the identifier (which user to update)
        const currentUsername = formData.get('currentUsername') as string;
        const currentEmail = formData.get('currentEmail') as string;
        
        // Get new values to update
        const newUsername = formData.get('username') as string;
        const newPassword = formData.get('password') as string;
        const newEmail = formData.get('email') as string;
        
        // Set up search parameters
        request.input('currentUsername', sql.VarChar, currentUsername);
        request.input('currentEmail', sql.VarChar, currentEmail);

        const updates: string[] = [];
        
        if (newUsername) {
            request.input('newUsername', sql.VarChar, newUsername);
            updates.push('username = @newUsername');
        }
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            request.input('newPassword', sql.VarChar, hashedPassword);
            updates.push('password = @newPassword');
        }
        if (newEmail) {
            request.input('newEmail', sql.VarChar, newEmail);
            updates.push('email = @newEmail');
        }
        
        if (updates.length === 0) {
            throw new Error('No fields to update');
        }
        
        const result = await request.query(`
            UPDATE Users 
            SET ${updates.join(', ')}
            WHERE username = @currentUsername OR email = @currentEmail
        `);
        
        return result;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update user.');
    }
}
 
export async function login(preState: any, formData: FormData){
    console.log(formData.get('username'))
    console.log(formData.get('password'))
    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        const username = formData.get('username') as string
        const password = formData.get('password') as string

        request.input('username', sql.VarChar, username)
        const result = await request.query('SELECT * FROM Users WHERE username = @username')
        
        const user = result.recordset[0]
        console.log(user)
        if(!user){
            return {
                error: 'Nothing was entered....'
            }
        }
        const isValid = await bcrypt.compare(password, user.password)

        if(!isValid){
            return{
                error:'Invalid credentials....'
            }
        }
        await createSession(user.user_id.toString())
        redirect('/'); {/* or whatever youre setting the homepage to for logged in users */}

    }catch(error){
        console.error('Database Error:', error);
        return {
            error: 'Failed to login. Please try again.'
        };
    }
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}