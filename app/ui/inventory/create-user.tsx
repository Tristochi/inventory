import {createUser} from "@/app/actions/auth"
import {useRouter} from 'next/navigation'

export default function CreateUser( {onCancel} : {onCancel: () => void }){
    const router = useRouter();

    return(
        <div className = 'text-sm p-8 text-gray-700 bg-gray-50 m-1 mb-2'>
        <form action = {createUser}>
                    <div className = "bg-white p-2">
                        <label className = "font-semibold  p-2 " htmlFor="username">Username</label>
                        <input className = "border border-gray-300 m-2" id = "username" name = "username" />
                    </div>
                    <div className = "bg-gray-50 p-2">
                        <label className = "font-semibold  p-2 " htmlFor="password">Password</label>
                        <input className = "border border-gray-300 m-2" id = "password" name = "password" type = "password"/>
                    </div>
                    <div className = "bg-white p-2">
                        <label className = "font-semibold  p-2 " htmlFor="email">Email</label>
                        <input className = "border border-gray-300 m-2 ml-9" id = "email" name = "email" type = "email"/>
                    </div>
                    <button onClick = {onCancel} className = "mt-6 p-6 bg-red-800 text-white py-2.5 rounded-lg font-medium hover:text-red-800 border-red-300 mr-2 hover:bg-red-100 hover:border-red-400 transition-colors"type = "submit">Cancel</button>
                    <button onClick = {() =>router.refresh}className = "mt-6 p-4 bg-red-800 text-white py-2.5 rounded-lg font-medium hover:text-red-800 border-red-300 p-2 hover:bg-red-100 hover:border-red-400 transition-colors"type = "submit">Create User</button>
                </form>
            </div>
    )
}