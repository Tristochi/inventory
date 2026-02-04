'use client'
import CreateUser from '@/app/ui/inventory/create-user'
import { fetchAllUsers } from '@/app/lib/user-data';
import { mockUsers } from '@/app/lib/mockUsers';
import { PencilIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { redirect } from 'next/navigation'
import {useState, useEffect, useRef} from 'react'
import {deleteUser, updateUser} from '@/app/actions/auth'
import {useRouter} from 'next/navigation'
import UpdateUser from '@/app/ui/inventory/edit-user'
import { useActionState} from 'react'


export default function UserTable() {
    const [showCreate, setShowCreate] = useState(false)
    const [editingUsername, seteditingUsername] = useState<string | null>(null)
    const [users, setUsers] = useState<any[]>([]);
    const router = useRouter();
    
    useEffect(() =>{
        async function getUsers(){
            const users = await fetchAllUsers()
            console.log(users)
            setUsers(users)
        }
        getUsers()
    }, [])

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editingUsername && formRef.current) {//sets view to current user being edited
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [editingUsername]);

    function handleDelete(username: any){
        deleteUser(username);
        router.refresh();
    }
 
    function handleCancelEdit(){
        seteditingUsername(null);//unsets what users being edited
    }

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-white p-2 shadow-sm md:pt-0">
                    {/* Mobile view */}
                    <div className="md:hidden">
                        <div className="flex-col grow ">
                            {!showCreate && (
                                <button 
                                    className="rounded-md border bg-red-800 border-red-300 p-2 hover:bg-red-100 hover:border-red-400 transition-colors"
                                    onClick={() => setShowCreate(true)}
                                    id="createButton"
                                >
                                    <PlusCircleIcon className="w-6 h-6 text-red-600 " />
                                    Create user
                                </button>
                            )}
                            {showCreate && (
                                <CreateUser onCancel={() => setShowCreate(false)} />
                            )}
                        </div>
                        {/* mobile user cards... */}
                    </div>

                    {/* Desktop view */}
                    <div className="flex-col items-center grow pt-2 text-white">
                        {!showCreate && (
                            <button 
                                className="flex gap-2 rounded-md bg-red-800 border hover:text-red-800 border-red-300 p-2 hover:bg-red-100 hover:border-none transition-colors"
                                onClick={() => setShowCreate(true)}
                                id="createButton"
                            >
                                <PlusCircleIcon className="w-6 h-6" />
                                Create user
                            </button>
                        )}
                        {showCreate && (
                            <CreateUser onCancel={() => setShowCreate(false)} />
                        )}
                    </div>
                    
                    <table className="hidden mt-4 min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg bg-gray-50 text-left text-sm font-normal">
                            <tr>
                                <th className="px-4 py-5 font-semibold">Username</th>
                                <th className="px-3 py-5 font-semibold">Email</th>
                                <th className="px-3 py-5 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {users?.map((user, index) => (
                                <tr 
                                    key={user.user_id} 
                                    className={`border-b border-gray-200 text-sm ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    } hover:bg-gray-100 transition-colors`}
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                                                {user.username[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-gray-700">{user.email_address}</td>
                                    
                                    <td className="px-3 py-4">
                                        <div className="gap-4">
                                            {editingUsername !== user.username && (
                                                <button 
                                                onClick={() => seteditingUsername(user.username)}//user set to form 
                                                    className="rounded-md border border-gray-300 p-2 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                                                    title="Edit user"
                                                >
                                                    <PencilIcon className="w-4 h-4 text-gray-600" />
                                                </button>
                                            )}
                                            
                                            {editingUsername === user.username && (//all this stuff is just for auto focusing the view on that user
                                                <div ref={formRef}>
                                                    <UpdateUser username = {user.username} email = {user.email} onCancel={handleCancelEdit} />
                                                </div>
                                            )}
                                            
                                            <button 
                                                onClick={() => handleDelete(user.username)}
                                                className="rounded-md border border-red-300 p-2 hover:bg-red-100 hover:border-red-400 transition-colors"
                                                title="Delete user"
                                            >
                                                <TrashIcon className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}