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
        request.input('email_address', sql.VarChar, userData.email);
        request.input('created_at', sql.DateTime, currentDate);
        
        const result = await request.query(`
            INSERT INTO Users (username, password, email_address, created_at)
            OUTPUT INSERTED.user_id
            VALUES (@username, @password, @email_address, GETDATE())
        `);
        
        const userId = result.recordset[0].user_id;
        console.log(userId)
        
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
        
        // Get new values to update
        const newUsername = formData.get('newUsername') as string;
        const newPassword = formData.get('password') as string;
        const newEmail = formData.get('email') as string;
        const username =  formData.get('username')
        const currentEmail = formData.get('currentEmail')
        // Set up search parameters
        request.input('username', sql.VarChar, username);
        request.input('currentEmail', sql.VarChar, currentEmail)

        const updates: string[] = [];
        console.log(newUsername, newPassword, newEmail)

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
        updates.push('last_modified_date = GETDATE()');

        const result = await request.query(`
            UPDATE Users 
            SET ${updates.join(',')}
            WHERE username = @username OR email_address = @currentEmail
        `);
        
        console.log(result)
        console.log('user updated')
        
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update user.');
    }
}
 
export async function login(preState: any, formData: FormData){
    console.log(formData.get('username'))
    console.log(formData.get('password'))
    const isValid = ''
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
        console.log(isValid)

        if(!isValid){
            await request.query(`UPDATE Users 
                SET last_successful_login = GETDATE()
                WHERE username = @username 
                `)
            return{
                success: false, error:'Invalid credentials....'
            }
        }
        await request.query(`UPDATE Users 
            SET last_successful_login = GETDATE()
            WHERE username = @username 
            `)
        
        await createSession(user.user_id.toString())
        console.log('Login successful')
        return{
            success: true, error:'Success....'
        }

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

export async function deleteUser(username: any){
    try {
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();

        request.input('username', sql.VarChar, username)

        const result = await request.query(

            `DELETE FROM USERS WHERE username = @username`
        )
        return result
    }catch(e){
        console.error('User not deleted:', e);
        return{
            errpr: 'Failed to delete user'
        }
    }
}