import { fetchAllUsers } from '@/app/lib/user-data';
import { mockUsers } from '@/app/lib/mockUsers';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default async function UserTable() {
    const users = mockUsers; //await fetchAllUsers();

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-white p-2 shadow-sm md:pt-0">
                    {/* Mobile view- probably not really needed but whatever */}
                    <div className="md:hidden">
                        {users?.map((user) => (
                            <div key={user.user_id} className="mb-2 w-full rounded-lg border border-gray-200 bg-white p-4">
                                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">{user.username}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                        <p className = "text-sm text-gray-500">{user.created_at}</p>
                                    </div>
                               
                                </div>
                                <div className="flex items-center justify-between pt-4">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Name:</span> {user.username} 
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="rounded-md border border-gray-300 p-2 hover:bg-gray-50">
                                            <PencilIcon className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <button className="rounded-md border border-red-300 p-2 hover:bg-red-50">
                                            <TrashIcon className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop view */}
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg bg-gray-50 text-left text-sm font-normal">
                            <tr>
                                <th className="px-4 py-5 font-semibold">Username</th>
                                <th className="px-3 py-5 font-semibold">Email</th>
                                <th className = "px-3 py-5 font-semibold"> Created On</th>
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
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                                                {user.username[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-gray-700">{user.email}</td>
                                    <td className="px-3 py-4 text-gray-700">{user.created_at}</td>
                                    <td className="px-3 py-4">
                                        <div className="flex gap-2">
                                            <button 
                                                className="rounded-md border border-gray-300 p-2 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                                                title="Edit user"
                                                id = "updateButton"
                                            >
                                                <PencilIcon className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button 
                                                className="rounded-md border border-red-300 p-2 hover:bg-red-100 hover:border-red-400 transition-colors"
                                                title="Delete user"
                                                id = "deleteButton"
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