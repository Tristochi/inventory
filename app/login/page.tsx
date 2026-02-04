'use client'
import { login } from '@/app/actions/auth'
import { useActionState, useEffect } from 'react'
import { redirect } from 'next/navigation'

export default function page() {
    const [state, formAction] = useActionState(login, {
        success: false,
         error: '' })

    useEffect (() =>{
        if(state.success){
            redirect('/inventory')
        }
    },[state.success, redirect])
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form action={formAction} className="w-full max-w-sm">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Login</h1>
                    
                    <div className="space-y-4">
                        <div>
                            <label 
                                htmlFor="username" 
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Username
                            </label>
                            <input 
                                id="username" 
                                name="username"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                placeholder="Enter your username"
                            />
                        </div>
                        
                        <div>
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Password
                            </label>
                            <input 
                                id="password" 
                                name="password" 
                                type="password"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>
                    
                    {state?.error && (
                        <p className="mt-4 text-sm text-red-600">{state.error}</p>
                    )}
                    
                    <button 
                        type="submit"
                        className="mt-6 w-full bg-red-800 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
                    >
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    )
}