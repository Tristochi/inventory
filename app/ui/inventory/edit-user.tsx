'use client'
import { useTransition } from 'react'
import { updateUser } from '@/app/actions/auth'

export default function UpdateUser({ username, email, onCancel }: { username: string, email: string, onCancel: () => void }) {
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {//must handle server function within a client only component by building formData then calling action
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        startTransition(() => {
            updateUser(formData)
        })
    }

    return (
        <div className='text-sm p-8 text-gray-700 bg-gray-50 m-1'>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="username" value={username} />
                <input type="hidden" name="currentEmail" value={email} />
                <div className="bg-white p-2">
                    <label className="font-semibold p-2" htmlFor="newUsername">Username</label>
                    <input className="border border-gray-300 m-2" id="newUsername" name="newUsername" />
                </div>
                <div className="bg-gray-50 p-2">
                    <label className="font-semibold p-2" htmlFor="password">Password</label>
                    <input className="border border-gray-300 m-2" id="password" name="password" type="password" />
                </div>
                <div className="bg-white p-2">
                    <label className="font-semibold p-2" htmlFor="email">Email</label>
                    <input className="border border-gray-300 m-2 ml-9" id="email" name="email" type="email" />
                </div>
                <button disabled={isPending} className="mt-6 p-6 bg-red-800 text-white py-2.5 rounded-lg font-medium hover:text-red-800 border-red-300 p-2 hover:bg-red-100 hover:border-red-400 transition-colors" type="submit">
                    {isPending ? 'Updating...' : 'Update'}
                </button>
                <button onClick={onCancel} type="button" className="ml-2 mt-6 p-6 bg-red-800 text-white py-2.5 rounded-lg font-medium hover:text-red-800 border-red-300 p-2 hover:bg-red-100 hover:border-red-400 transition-colors">
                    Cancel
                </button>
            </form>
        </div>
    )
}